const express = require("express");
const Member = require("../models/member");
const Team = require("../models/team");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post('/members', async (req, res) => {
    const member = new Member(req.body);

    try {
        await member.save();
        const token = await member.generateAuthToken();
        res.status(201).send({member, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/members/login', async (req, res) => {
    try {
        const member = await Member.findByCredentials(req.body.idfNumber, req.body.password);
        const token = await member.generateAuthToken();
        res.send({ member, token });
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/members/logout', auth, async (req, res) => {
    try {
        req.member.tokens = req.member.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.member.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/members/logoutAll', auth, async (req, res) => {
    try {
        req.member.tokens = [];
        await req.member.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/members', async (req, res) => {
    try {
        const members = await Member.find({});
        res.send(members);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/members/me', auth, async (req, res) => {
    res.send(req.member);
});

router.patch('/members/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "idfNumber", "password"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    } 

    try {
        updates.forEach((update) => req.member[update] = req.body[update]);
        await req.member.save();
        res.send(req.member);
    } catch (e) {
        res.status(400).send();
    }
});

router.delete('/members/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const member = await Member.findByIdAndDelete(_id);
        let index;
        const teams = await Team.find({});
        const team = teams.find((team) => {
            index = team.members.findIndex((member) => member === _id);
            if (index >= 0) {
                return true;
            }
            return false;
        });
        if (team) {    
            const updatedMembers = team.members;
            updatedMembers.splice(index, 1);
            await Team.updateOne({ _id: team.id }, { members: updatedMembers }, { new: true, runValidators: true });
        }

        res.send(`The member ${member.name} was deleted successfully!`);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;