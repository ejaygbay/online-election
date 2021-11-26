const express = require('express');
const router = express.Router();

router.get('/vote', (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('vote', { page: 'vote', role: role });
    } else {
        res.redirect('/login');
    }
})

module.exports = router;