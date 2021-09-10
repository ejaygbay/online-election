const express = require('express');
const router = express.Router();

router.get('/contestant', (req, res) => {
    res.render('contestant', { page: 'contestant' });
})

module.exports = router;