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
    if (req.query.id) {
        let election_id = req.query.id;
        db.all(`SELECT * FROM elections WHERE id = ?`, election_id, (err, data) => {
            res.send(data);
        });
    } else {
        db.all("SELECT * FROM elections;", (err, data) => {
            res.send(data);
        });
    }
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
    getElections,
    updateElection,
    deleteElection
}