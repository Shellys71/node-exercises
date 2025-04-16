const express = require("express");
const Member = require("../models/member");
const Team = require("../models/team");
const auth = require("../middleware/auth");
const router = new express.Router();
const codes = require("../enums/status-codes");

router.post('/members', async (req, res) => {
    const member = new Member(req.body);

    try {
        await member.save();
        const token = await member.generateAuthToken();
        res.status(codes.CREATED).send({member, token});
    } catch (e) {
        res.status(codes.BAD_REQUEST).send(e);
        console.log(e);
    }
});

router.post('/members/login', async (req, res) => {
    try {
        const member = await Member.findByCredentials(req.body.idfNumber, req.body.password);
        const token = await member.generateAuthToken();
        res.send({ member, token });
    } catch (e) {
        res.status(codes.BAD_REQUEST).send(e);
    }
})

router.post('/members/logout', auth, async (req, res) => {
    try {
        req.member.tokens = req.member.tokens.filter((token) => token.token !== req.token);
        await req.member.save();

        res.send();
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

router.post('/members/logoutAll', auth, async (req, res) => {
    try {
        req.member.tokens = [];
        await req.member.save();
        res.send();
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/members/leaders', auth, async (req, res) => {
    const sort = {};

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

try {
    let leaders = [];
    const teams = await Team.find().sort(sort);
    teams.forEach(async (team) => {
        await team.populate("members");
        leaders = team.members.filter((member) => member.isLeader);
        leaders.push(leaders);
    });
    res.send(leaders);
} catch (e) {
    console.log(e);
    res.status(500).send();
}
});

router.get('/members', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.isLeader) {
        match.isLeader = req.query.isLeader === "true";
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        const members = await Member.find(match).sort(sort).limit(req.query.limit).skip(req.query.skip);
        res.send(members);
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/members/me', auth, async (req, res) => {
    res.send(req.member);
    req.member.populate('team');
    req.send(req.member.team)
});

router.patch('/members/:id', auth, async (req, res) => {
    if (!req.member.isLeader) {
        return res.status(codes.UNAUTHORIZED).send("Only leaders can update data!");
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "idfNumber", "password", "isLeader", "team", "pazam"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(codes.BAD_REQUEST).send({ error: "Invalid updates!" });
    } 
    
    try {
        const member = await Member.findById(req.params.id);

        if (updates.includes("team")) {
            if (req.member.isLeader) {
                return res.status(codes.FORBIDDEN).send("Leader can't switch teams!");
            }
            const team = await Team.findOne({name: req.body.team});
            req.body.team = team._id;
        }

        updates.forEach((update) => req.member[update] = req.body[update]);
        await req.member.save();

        if (!member) {
            return res.status(codes.NOT_FOUND).send();
        }

        res.send(req.member);
    } catch (e) {
        res.status(codes.BAD_REQUEST).send();
    }
});

router.delete('/members/:id', auth, async (req, res) => {
    if (!req.member.isLeader) {
        return res.status(codes.UNAUTHORIZED).send("Only leaders can update data!");
    }

    try {
        await req.member.deleteOne();
        res.send(`The member ${req.member.name} was deleted successfully!`);
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

module.exports = router;