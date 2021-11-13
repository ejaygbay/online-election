const POSITIONS = require('../models/table').POSITIONS;

const getPositionView = (req, res) => {
    res.render('position', { page: 'position' });
}

const createPosition = (req, res) => {
    req.session.userID = "f759fa54-6640-416a-a01c-9e1ae1b1fd21";
    req.session.electionID = "8c25132a-5e69-4572-8944-565d5c0eabc6";
    req.session.role = "superadmin";

    let role = req.session.role;
    let user_id = req.session.userID;
    let election_id = req.session.electionID;
    let position_name = req.query.name.trim();

    if (role === "superadmin") {
        election_id = req.query.id.trim();
    }

    if (position_name.length > 0) {
        POSITIONS
            .findOrCreate({
                where: {
                    position_name: position_name,
                    election_id: election_id
                },
                defaults: {
                    user_id: user_id,
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
}

const getPositions = (req, res) => {
    if (req.query.id) {
        queryPositions(req.query.id, data => {
            res.send(data);
        })
    } else {
        queryPositions(null, data => {
            res.send(data);
        })
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


// ================================================



const createParty = (req, res) => {
    let party_name = req.query.name.trim();
    req.session.userID = "f759fa54-6640-416a-a01c-9e1ae1b1fd21";
    req.session.electionID = "8c25132a-5e69-4572-8944-565d5c0eabc6";
    req.session.role = "superadmin";
    let userID = req.session.userID;
    let electionID = req.session.electionID;

    if (party_name.length > 0) {

    } else {
        res.send({ status: 1, msg: 'Invalid party name' })
    }
}

const getParties = async(req, res) => {
    console.log("Get Parties ====================");
    if (req.query.id) {
        queryParties(req.query.id, data => {
            res.send(data);
        })
    } else {
        queryParties(null, data => {
            res.send(data);
        })
    }
}

const updateParty = (req, res) => {
    let party_id = req.query.id;
    let party_name = req.query.name;

    PARTY.update({
        party_name: party_name
    }, {
        where: {
            id: party_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Party updated' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Party not updated' });
    })
}

const deleteParty = (req, res) => {
    let party_id = req.query.id;

    PARTY.destroy({
        where: {
            id: party_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Party deleted' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Party not deleted' });
    })
}

const queryPositions = async(position_id, callback) => {
    if (position_id) {
        POSITIONS
            .findOne({
                where: { id: position_id, status: 'active' }
            })
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
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

// queryParties();

// module.exports = {
//     createParty,
//     getParties,
//     updateParty,
//     deleteParty
// }

module.exports = {
    getPositionView,
    createPosition,
    getPositions,
    updatePosition,
    deletePosition
}