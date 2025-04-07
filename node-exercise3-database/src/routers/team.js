const express = require("express");
const Team = require("../models/team");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post('/teams', async (req, res) => {
    const team = new Team(req.body);

    try {
        await team.save();
        res.status(201).send(team);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find({});
        res.send(teams);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/teams/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const team = await Team.findById(_id);

        if (!team) {
            return res.status(404).send();
        }

        res.send(team);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/teams/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "leader", "members"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    } 

    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!team) {
            return res.status(404).send();
        }

        res.send(team);
    } catch (e) {
        res.status(400).send();
    }
});

router.delete('/teams/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);

        if (!team) {
            return res.status(404).send();
        }

        res.send(team);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/teams/leader/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const team = await Team.findOne({name});

        if (!team) {
            return res.status(404).send();
        }

        res.send(`The leader of team ${name} is ${team.leader}`);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/teams/team/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const teams = await Team.find({});
        const team = teams.find((team) => team.members.includes(_id));

        if (!team) {
            return res.status(404).send();
        }

        res.send(`This member is in team ${team.name}`);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/teams/members/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const team = await Team.findById(_id);

        if (!team) {
            return res.status(404).send();
        }

        res.send(`This team includes ${team.members.length} members`);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;