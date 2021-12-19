const express = require('express');
const router = express.Router();
const voterControllers = require('../controllers/voter-controller');

router.get('/voters', voterControllers.votersView);

router.post('/voter', voterControllers.createVoter);

router.get('/voter', voterControllers.getVoters);

router.get('/voter/count', voterControllers.getVoterCounts);

router.patch('/voter', voterControllers.updateVoter);

router.delete('/voter', voterControllers.deleteVoter);

module.exports = router;