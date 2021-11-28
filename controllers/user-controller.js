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

const createUser = (req, res) => {
    let first_name = req.body.first_name;
    let middle_name = req.body.middle_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let election_id = req.body.election_id;
    let role_id = req.body.role_id;

    if (middle_name.length < 1) {
        delete req.body.middle_name;
    }

    if (validateUserData(req.body)) {
        USERS
            .findOrCreate({
                where: {
                    email: first_name,
                    election_id: election_id
                },
                defaults: {
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    email: email,
                    password: password,
                    role_id: role_id,
                    election_id: election_id
                }
            })
            .then(result => {
                if (result[1] === true) {
                    res.send({ status: 0, msg: 'User created' });
                } else {
                    res.send({ status: 1, msg: 'User already exists' });
                }
            })
            .catch(err => {
                console.log("ERRORRRR>>>>>>>>>>>>>", err);
                res.send({ status: 1, msg: 'User not created' });
            })
    } else {
        res.send({ status: 1, msg: 'Invalid user name' })
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

const validateUserData = (data) => {
    let count = 0;
    for (let items in data) {
        if (data[items].length < 1) {
            count++;
            break;
        }
    }

    if (count > 0)
        return false
    else
        return true;
}

module.exports = {
    getUserView,
    createUser,
    getUsers,
    updateUser,
    deleteUser
}