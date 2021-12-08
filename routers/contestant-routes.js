const express = require('express');
const router = express.Router();
const contestantControllers = require('../controllers/contestant-controller');

router.get('/contestant/create', contestantControllers.getContestantView);

router.post('/contestant', contestantControllers.createContestant);

router.get('/contestant', contestantControllers.getContestants);

router.patch('/contestant', contestantControllers.updateContestant);

router.delete('/contestant', contestantControllers.deleteContestant);

module.exports = router;