const express = require('express');
const router = express.Router();
const electionControllers = require('../controllers/election-controller');

router.get('/election/create', electionControllers.getElectionView);

router.post('/election', electionControllers.createElection);

router.get('/election', electionControllers.getElections);

router.patch('/election', electionControllers.updateElection);

router.delete('/election', electionControllers.deleteElection);

module.exports = router;