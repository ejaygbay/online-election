let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./tyaElectionDB.db');

// const createTables = () => {
/** ELECTIONS TABLE */
db.run(`CREATE TABLE IF NOT EXISTS elections(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, election_name VARCHAR(30), date_created DATETIME);
    `, (err, result) => {
    !err ? console.log("Elections table created.") : console.log("Elections table not created.")
})

/** PARTIES TABLE */
db.run(`CREATE TABLE IF NOT EXISTS parties(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, party_name VARCHAR(30), date_created DATETIME);
    `, (err, result) => {
    !err ? console.log("Parties table created.") : console.log("Parties table not created.")
})

/** POSITIONS TABLE */
db.run(`CREATE TABLE IF NOT EXISTS positions(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, position_name VARCHAR(30), election_id INTEGER NOT NULL, date_created DATETIME);
    `, (err, result) => {
    !err ? console.log("Positions table created.") : console.log("Positions table not created.")
})

/** POSITIONS TABLE */
// db.run(`CREATE TABLE IF NOT EXISTS positions(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, position_name VARCHAR(30), election_id INTEGER NOT NULL, date_created DATETIME);
//     `, (err, result) => {
//     !err ? console.log("Positions table created.") : console.log("Positions table not created.")
// })

/** CONTESTANT TABLE */
db.run(`CREATE TABLE IF NOT EXISTS contestants(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, position_id INTEGER NOT NULL, election_id INTEGER NOT NULL, photo_path VARCHAR(255), date_created DATETIME);
    `, (err, result) => {
    !err ? console.log("Contestants table created.") : console.log("Contestants table not created.")
})

// }

// module.exports = createTables;