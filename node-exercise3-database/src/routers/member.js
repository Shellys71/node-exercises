const express = require("express");
const Member = require("../models/member");
const Team = require("../models/team");
const router = new express.Router();

router.post('/members', async (req, res) => {
    const member = new Member(req.body);

    try {
        await member.save();
        res.status(201).send(member);
    } catch (e) {
        res.status(400).send(e);
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

router.get('/members/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const member = await Member.findById(_id);

        if (!member) {
            return res.status(404).send();
        }

        res.send(member);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/members/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "idfNumber", "email", "isOpenBase"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    } 

    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!member) {
            return res.status(404).send();
        }

        res.send(member);
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