const express = require('express');
const router = express.Router();
const electionControllers = require('../controllers/election-controller');

router.get('/create_election', (req, res) => {
    res.render('election', { page: 'election' });
})

router.post('/election', electionControllers.createElection);

router.get('/election', electionControllers.getElections);

router.put('/election', electionControllers.updateElection);

router.delete('/election', electionControllers.deleteElection);

module.exports = router;