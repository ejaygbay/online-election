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
            !err ? res.send(data) : res.send(err);
        });
    } else {
        db.all("SELECT * FROM elections;", (err, data) => {
            !err ? res.send(data) : res.send(err);
        });
    }
}

const updateElection = (req, res) => {
    db.run(`UPDATE elections SET election_name = ? WHERE id = ?;`, req.query.name, req.query.id, (err) => {
        if (!err) {
            res.send({ status: 0, msg: 'Election updated' });
        } else {
            res.send({ status: 1, msg: 'Election not updated' });
        }
    });
}

const deleteElection = (req, res) => {
    let election_id = req.query.id;
    db.run(`DELETE FROM elections WHERE id = ?;`, election_id, (err, err2) => {
        if (!err) {
            res.send({ status: 0, msg: 'Election deleted' });
        } else {
            res.send({ status: 1, msg: 'Election not deleted' });
        }
    });
}

module.exports = {
    createElection,
    getElections,
    updateElection,
    deleteElection
}