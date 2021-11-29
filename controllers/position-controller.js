const POSITIONS = require('../models/table').POSITIONS;

const getPositionView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('position', { page: 'position', role: role });
    } else {
        res.redirect('/login');
    }
}

const createPosition = (req, res) => {
    let position_name = req.query.name.trim();
    let election_id = req.query.id.trim();
    let userID = req.session.userID;

    if (userID) {
        if (!election_id) {
            election_id = req.session.electionID;
        }

        if (position_name.length > 0) {
            POSITIONS
                .findOrCreate({
                    where: {
                        position_name: position_name,
                        election_id: election_id
                    },
                    defaults: {
                        user_id: userID,
                        election_id: election_id,
                        position_name: position_name
                    }
                })
                .then(result => {
                    if (result[1] === true) {
                        res.send({ status: 0, msg: 'Position created' });
                    } else {
                        res.send({ status: 1, msg: 'Position already exists' });
                    }
                })
                .catch(err => {
                    console.log("ERRORRRR>>>>>>>>>>>>>", err);
                    res.send({ status: 1, msg: 'Position not created' });
                })
        } else {
            res.send({ status: 1, msg: 'Invalid position name' })
        }
    } else {
        res.send("You are not authorized");
    }
}

const getPositions = (req, res) => {
    if (req.session.role === "admin") {
        queryPositions(req.session.electionID, data => {
            res.send(data);
        })
    } else {
        queryPositions(req.query.id, data => {
            res.send(data);
        })
    }
}

const updatePosition = (req, res) => {
    let position_id = req.query.id;
    let position_name = req.query.name;

    POSITIONS.update({
        position_name: position_name
    }, {
        where: {
            id: position_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Position updated' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Position not updated' });
    })
}

const deletePosition = (req, res) => {
    let position_id = req.query.id;
    POSITIONS.destroy({
        where: {
            id: position_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Position deleted' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Position not deleted' });
    })
}

const queryPositions = async(election_id, callback) => {
    if (election_id) {
        POSITIONS
            .findAll({
                where: {
                    election_id: election_id
                },
                attributes: ['id', 'position_name']
            })
            .then(result => {
                let results = [];
                result.forEach(ele => {
                    results.push(ele.dataValues);
                })

                return callback(results);
            })
            .catch(err => {
                console.log("_---------------", err);
            })
    } else {
        POSITIONS
            .findAll({
                where: { status: 'active' },
                attributes: ['id', 'position_name']
            })
            .then(result => {
                let results = [];
                result.forEach(ele => {
                    results.push(ele.dataValues);
                })
                return callback(results);
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = {
    getPositionView,
    createPosition,
    getPositions,
    updatePosition,
    deletePosition
}