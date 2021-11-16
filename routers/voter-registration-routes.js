const express = require('express');
const router = express.Router();
const votersRegistrationControllers = require('../controllers/voter-registration-controller');

router.get('/voters/registration', votersRegistrationControllers.votersRegistrationView);

router.post('/Voter', votersRegistrationControllers.createVoter);

router.get('/Voter', votersRegistrationControllers.getVoters);

router.patch('/Voter', votersRegistrationControllers.updateVoter);

router.delete('/Voter', votersRegistrationControllers.deleteVoter);

module.exports = router;