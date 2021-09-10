const express = require('express');
const router = express.Router();

router.get('/vote', (req, res) => {
    res.render('vote', { page: 'vote' });
})

module.exports = router;