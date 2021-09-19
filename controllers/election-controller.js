let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./tyaElectionDB.db');

const createElection = (req, res) => {
    let election_name = req.query.name.trim();

    if (election_name.length > 0) {
        db.run(`INSERT INTO elections("election_name", "date_created") VALUES(?, datetime('now'));`, election_name, (err, result) => {
            if (!err) {
                res.send({ status: 0, msg: 'Election created' });
            } else {
                res.send({ status: 1, msg: 'Election not created' });
            }
        })
    } else {
        res.send({ status: 1, msg: 'Invalid election name' })
    }
}

const getElections = (req, res) => {
    db.run(`SELECT * FROM elections`, (err, result) => {
        console.log(result, err);
    });
}

const getElection = (req, res) => {
    let election_id = 1;
    db.run(`SELECT * FROM elections WHERE election_id = ?`, election_id, (err, result) => {
        console.log("Err:", err);
        console.log("Result:", result);
    });
}

const updateElection = (req, res) => {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS roles(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, role_name VARCHAR(20), date_created DATETIME)");
    });
}

const deleteElection = (req, res) => {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS roles(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, role_name VARCHAR(20), date_created DATETIME)");
    });
}

module.exports = {
    createElection,
    getElection,
    getElections,
    updateElection,
    deleteElection
}