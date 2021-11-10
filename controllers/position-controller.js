let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./electionDB.db');

const getPositionView = (req, res) => {
    res.render('position', { page: 'position' });
}

const createPosition = (req, res) => {
    let position_name = req.query.name.trim();
    let election_id = req.query.id.trim();

    if (position_name.length > 0) {
        db.run(`INSERT INTO positions("position_name", "election_id", "date_created") VALUES(?, ?, datetime('now'));`, position_name, election_id, (err, result) => {
            if (!err) {
                res.send({ status: 0, msg: 'position created' });
            } else {
                res.send({ status: 1, msg: 'position not created' });
            }
        })
    } else {
        res.send({ status: 1, msg: 'Invalid position name' })
    }
}

const getPositions = (req, res) => {
    if (req.query.id) {
        let election_id = req.query.id;
        db.all(`SELECT * FROM positions WHERE election_id = ?`, election_id, (err, data) => {
            !err ? res.send(data) : res.send(err);
        });
    } else {
        db.all("SELECT * FROM positions;", (err, data) => {
            !err ? res.send(data) : res.send(err);
        });
    }
}

const updatePosition = (req, res) => {
    db.run(`UPDATE positions SET position_name = ? WHERE id = ?;`, req.query.name, req.query.id, (err) => {
        if (!err) {
            res.send({ status: 0, msg: 'position updated' });
        } else {
            res.send({ status: 1, msg: 'position not updated' });
        }
    });
}

const deletePosition = (req, res) => {
    let position_id = req.query.id;
    db.run(`DELETE FROM positions WHERE id = ?;`, position_id, (err, err2) => {
        if (!err) {
            res.send({ status: 0, msg: 'position deleted' });
        } else {
            res.send({ status: 1, msg: 'position not deleted' });
        }
    });
}

module.exports = {
    getPositionView,
    createPosition,
    getPositions,
    updatePosition,
    deletePosition
}