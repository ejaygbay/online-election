const express = require('express');
const router = express.Router();
const votersRegistrationControllers = require('../controllers/voter-registration-controller');

router.get('/voters/registration', votersRegistrationControllers.votersRegistrationView);

router.post('/voter', votersRegistrationControllers.createVoter);

router.get('/voter', votersRegistrationControllers.getVoters);

router.patch('/voter', votersRegistrationControllers.updateVoter);

router.delete('/voter', votersRegistrationControllers.deleteVoter);

module.exports = router;