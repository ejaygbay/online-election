const express = require('express');
const router = express.Router();
const partyControllers = require('../controllers/party-controller');

router.get('/party/create', partyControllers.getPartyView);

router.post('/party', partyControllers.createParty);

router.get('/party', partyControllers.getParties);

router.patch('/party', partyControllers.updateParty);

router.delete('/party', partyControllers.deleteParty);

module.exports = router;