let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./electionDB.db');

const createElection = (election_name) => {
    // db.run(`INSERT INTO elections("election_name", "date_created") VALUES(?, datetime('now'));`, election_name, (err, result) => {
    // if (!err) {
    //     await JSON.stringify({ status: 0, msg: 'Election created' });
    // } else {
    //     await JSON.stringify({ status: 1, msg: 'Election not created' });
    // }
    // return err;
    // })
    console.log("Received")
    return ({ status: 1, msg: 'Election not created' })
}

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