const express = require("express");
const Team = require("../models/team");
const auth = require("../middleware/auth");
const router = new express.Router();
const codes = require("../enums/status-codes");

router.post('/teams', auth, async (req, res) => {
    if (!req.member.isLeader) {
        return res.status(codes.UNAUTHORIZED).send("Only leaders can update data!");
    }
    if (req.member.team) {
        return res.status(codes.FORBIDDEN).send("Leader already has a team!");
    }

    const team = new Team(req.body);

    try {
        await team.save();
        req.member.team = team._id;
        await req.member.save();
        res.status(codes.CREATED).send(team);
    } catch (e) {
        res.status(codes.BAD_REQUEST).send(e);
    }
});

router.get('/teams', auth, async (req, res) => {
    try {
        const teams = await Team.find({});
        res.send(teams);
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/teams/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const team = await Team.findById(_id);

        if (!team) {
            return res.status(codes.NOT_FOUND).send();
        }

        res.send(team);
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

router.patch('/teams/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(codes.BAD_REQUEST).send({ error: "Invalid updates!" });
    } 

    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!team) {
            return res.status(codes.NOT_FOUND).send();
        }

        res.send(team);
    } catch (e) {
        res.status(codes.BAD_REQUEST).send();
    }
});

router.delete('/teams/:id', auth, async (req, res) => {
    if (!req.member.isLeader) {
        return res.status(codes.UNAUTHORIZED).send("Only leaders can update data!");
    }

    try {
        const team = await Team.findById(req.params.id);
        await team.deleteOne();


        if (!team) {
            return res.status(codes.NOT_FOUND).send();
        }

        res.send(team);
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/teams/leader/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const team = await Team.findOne({name});

        if (!team) {
            return res.status(codes.NOT_FOUND).send();
        }

        res.send(`The leader of team ${name} is ${team.leader}`);
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/teams/team/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const teams = await Team.find({});
        const team = teams.find((team) => team.members.includes(_id));

        if (!team) {
            return res.status(codes.NOT_FOUND).send();
        }

        res.send(`This member is in team ${team.name}`);
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/teams/members/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const team = await Team.findById(_id);

        if (!team) {
            return res.status(codes.NOT_FOUND).send();
        }

        res.send(`This team includes ${team.members.length} members`);
    } catch (e) {
        res.status(codes.INTERNAL_SERVER_ERROR).send();
    }
});

module.exports = router;