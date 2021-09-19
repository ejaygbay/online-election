const express = require('express');
const app = express();
const PORT = 3100;
const dashboard_routes = require('./routers/dashboard-routes');
const election_routes = require('./routers/election-routes');
const vote_routes = require('./routers/vote-routes');
const position_routes = require('./routers/position-routes');
const contestant_routes = require('./routers/contestant-routes');

// create_tables
require('./models/table');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname, +'/public'));

app.use(dashboard_routes);
app.use(election_routes);
app.use(vote_routes);
app.use(position_routes);
app.use(contestant_routes);

app.get('/register', (req, res) => {
    res.render('register', { page: 'register' });
})




app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});