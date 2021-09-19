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


// electionControllers.createElection(, async(result) => {
//     await console.log(result);
//     // res.send({ 'code': 0 });
// })
// }

const getElection = (election_name) => {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS roles(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, role_name VARCHAR(20), date_created DATETIME)");
    });
}

const updateElection = (election_name) => {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS roles(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, role_name VARCHAR(20), date_created DATETIME)");
    });
}

const deleteElection = (election_name) => {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS roles(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, role_name VARCHAR(20), date_created DATETIME)");
    });
}

module.exports = {
    createElection,
    getElection,
    updateElection,
    deleteElection
}