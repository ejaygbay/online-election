let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./tyaElectionDB.db');

const createPosition = (req, res) => {
    let party_name = req.query.name.trim();

    if (party_name.length > 0) {
        db.run(`INSERT INTO parties("party_name", "date_created") VALUES(?, datetime('now'));`, party_name, (err, result) => {
            if (!err) {
                res.send({ status: 0, msg: 'Party created' });
            } else {
                res.send({ status: 1, msg: 'Party not created' });
            }
        })
    } else {
        res.send({ status: 1, msg: 'Invalid party name' })
    }
}

const getPositions = (req, res) => {
    if (req.query.id) {
        let party_id = req.query.id;
        db.all(`SELECT * FROM parties WHERE id = ?`, party_id, (err, data) => {
            !err ? res.send(data) : res.send(err);
        });
    } else {
        db.all("SELECT * FROM parties;", (err, data) => {
            !err ? res.send(data) : res.send(err);
        });
    }
}

const updatePosition = (req, res) => {
    db.run(`UPDATE parties SET party_name = ? WHERE id = ?;`, req.query.name, req.query.id, (err) => {
        if (!err) {
            res.send({ status: 0, msg: 'Party updated' });
        } else {
            res.send({ status: 1, msg: 'Party not updated' });
        }
    });
}

const deletePosition = (req, res) => {
    let party_id = req.query.id;
    db.run(`DELETE FROM parties WHERE id = ?;`, party_id, (err, err2) => {
        if (!err) {
            res.send({ status: 0, msg: 'Party deleted' });
        } else {
            res.send({ status: 1, msg: 'Party not deleted' });
        }
    });
}

module.exports = {
    createPosition,
    getPositions,
    updatePosition,
    deletePosition
}