let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./election');

const createElectionsTable = () => {
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS roles(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, role_name VARCHAR(20), date_created DATETIME)");
    });

    db.close();
}



// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database("../records");

// const Roles = () => {
//     db.serialize(function() {
//         db.run("CREATE TABLE IF NOT EXISTS roles(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, role_name VARCHAR(20), date_created DATETIME)");
//     });
// }

// const Users = () => {
//     db.serialize(function() {
//         db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, first_name VARCHAR(15), last_name VARCHAR(15), username VARCHAR(15), pwd_id VARCHAR(20), role_id VARCHAR(20) date_created DATETIME)");
//     });
// }

// module.exports = {
//     Roles,
//     Users
// }