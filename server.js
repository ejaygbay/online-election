const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname, +'/public'));


app.get('/', (req, res) => {
    res.render('dashboard');
})

app.get('/result', (req, res) => {
    res.send("Result Page");
})

app.get('/voters', (req, res) => {
    res.send("View Voters Page");
})

app.post('/voters', (req, res) => {
    res.send("Voter Created Page");
})

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});