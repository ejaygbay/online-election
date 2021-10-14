const dashboardView = (req, res) => {
    session=req.session;
    session.port = process.env.PORT || 3000;
    console.log(req.session);
    res.render('dashboard', { page: 'dashboard' });
}

module.exports = dashboardView;