const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname, +'/public'));


app.get('/', (req, res) => {
    res.render('dashboard');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/election', (req, res) => {
    res.render('election');
})

app.get('/position', (req, res) => {
    res.render('position');
})

app.get('/contestant', (req, res) => {
    res.render('contestant');
})

app.get('/vote', (req, res) => {
    res.render('vote');
})


app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});