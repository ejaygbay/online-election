const USERS = require('../models/table').USERS;

const getUserView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('user', { page: 'user', role: role });
    } else {
        res.redirect('/login');
    }
}

const createUserOld = (req, res) => {
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

const createUser = (req, res) => {
    console.log(req.body)

    let first_name = req.body.first_name;
    let middle_name = req.body.middle_name;
    let last_name = req.body.last_name;
    let election_id = req.session.electionID;
    let role_id = req.body.role;



    if (middle_name.length < 1) {
        delete req.body.middle_name;
    }

    if (role === "superadmin") {
        election_id = req.body.election_id;
    }

    if (validateContestantData(req.body)) {
        CONTESTANTS
            .findOrCreate({
                where: {
                    email: first_name,
                    election_id: election_id
                },
                defaults: {
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    user_id: user_id,
                    election_id: election_id,
                    position_id: position_id,
                    party_id: party_id,
                    photo: contestant_img
                }
            })
            .then(result => {
                if (result[1] === true) {
                    res.send({ status: 0, msg: 'Contestant created' });
                } else {
                    res.send({ status: 1, msg: 'Contestant already exists' });
                }
            })
            .catch(err => {
                console.log("ERRORRRR>>>>>>>>>>>>>", err);
                res.send({ status: 1, msg: 'Contestant not created' });
            })
    } else {
        res.send({ status: 1, msg: 'Invalid contestant name' })
    }
}

const getUsers = (req, res) => {
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

const updateUser = (req, res) => {
    db.run(`UPDATE positions SET position_name = ? WHERE id = ?;`, req.query.name, req.query.id, (err) => {
        if (!err) {
            res.send({ status: 0, msg: 'position updated' });
        } else {
            res.send({ status: 1, msg: 'position not updated' });
        }
    });
}

const deleteUser = (req, res) => {
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
    getUserView,
    createUser,
    getUsers,
    updateUser,
    deleteUser
}