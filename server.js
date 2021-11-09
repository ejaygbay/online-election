const express = require('express');
const app = express();
const PORT = process.env.PORT || 3200;
const dashboard_routes = require('./routers/dashboard-routes');
const election_routes = require('./routers/election-routes');
const party_routes = require('./routers/party-routes');
const vote_routes = require('./routers/vote-routes');
const position_routes = require('./routers/position-routes');
const contestant_routes = require('./routers/contestant-routes');
const voters_registration_routes = require('./routers/voter-registration-routes');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// cookie parser middleware
app.use(cookieParser());

// create_tables
require('./models/table');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname, +'/public'));

app.use(dashboard_routes);
app.use(election_routes);
app.use(party_routes);
app.use(vote_routes);
app.use(position_routes);
app.use(contestant_routes);
app.use(voters_registration_routes);

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});
