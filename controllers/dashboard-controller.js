const dashboardView = (req, res) => {
    res.render('dashboard', { page: 'dashboard' });
}

module.exports = dashboardView;