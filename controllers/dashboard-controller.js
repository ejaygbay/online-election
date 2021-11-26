const dashboardView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('dashboard', { page: 'dashboard', role: role });
    } else {
        res.redirect('/login');
    }
}

module.exports = dashboardView;