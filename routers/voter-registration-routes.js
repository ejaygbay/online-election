const express = require('express');
const router = express.Router();
const votersRegistrationControllers = require('../controllers/voter-registration-controller');

router.get('/voters/registration', votersRegistrationControllers.votersRegistrationView);

router.post('/position', votersRegistrationControllers.createPosition);

router.get('/position', votersRegistrationControllers.getPositions);

router.patch('/position', votersRegistrationControllers.updatePosition);

router.delete('/position', votersRegistrationControllers.deletePosition);

module.exports = router;