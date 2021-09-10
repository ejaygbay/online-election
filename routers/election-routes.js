const express = require('express');
const router = express.Router();

router.get('/election', (req, res) => {
    res.render('election', { page: 'election' });
})

module.exports = router;