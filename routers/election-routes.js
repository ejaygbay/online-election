const express = require('express');
const router = express.Router();
const electionControllers = require('../controllers/election-controller');

router.get('/election', (req, res) => {
    res.render('election', { page: 'election' });
})

router.post('/election', electionControllers.createElection);

module.exports = router;