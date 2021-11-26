const dashboardView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;
    console.log(role)

    if (userID && role) {
        res.render('dashboard', { page: 'dashboard', role: role });
    } else {
        res.render('./login', { page: 'login' });
    }
}

module.exports = dashboardView;