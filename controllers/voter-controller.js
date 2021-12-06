const VOTERS = require('../models/table').VOTERS;

const votersRegistrationView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('voter-registration', { page: 'register', role: role });
    } else {
        res.redirect('/login');
    }
}

const createVoter = (req, res) => {
    let role = req.session.role;
    let user_id = req.session.userID;
    let election_id = req.session.electionID;

    let first_name = req.body.first_name;
    let middle_name = req.body.middle_name;
    let last_name = req.body.last_name;
    let position_id = req.body.position_id;
    let party_id = req.body.party_id;
    let voter_img = req.body.voter_img;

    if (middle_name.length < 1) {
        delete req.body.middle_name;
    }

    if (role === "superadmin") {
        election_id = req.body.election_id;
    } else {
        req.body.election_id = election_id;
    }

    if (validateVoterData(req.body)) {
        VOTERS
            .findOrCreate({
                where: {
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
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
                    photo: voter_img
                }
            })
            .then(result => {
                if (result[1] === true) {
                    res.send({ status: 0, msg: 'Voter created' });
                } else {
                    res.send({ status: 1, msg: 'Voter already exists' });
                }
            })
            .catch(err => {
                res.send({ status: 1, msg: 'Voter not created' });
            })
    } else {
        res.send({ status: 1, msg: 'Invalid voter name' })
    }
}

const getVoters = (req, res) => {
    req.session.electionID = "33f23b2b-f1c8-4eb4-902e-774eb6a8e759";
    // let electionID = req.session.electionID;

    if (req.session.electionID) {
        queryVoters(req.session.electionID, data => {
            console.log("Res:=======", data);
            res.send(data);
        })
    } else {
        queryVoters(null, data => {
            res.send(data);
        })
    }
}

const getVoterCounts = (req, res) => {
    VOTERS
        .count({
            where: {
                election_id: req.session.electionID
            }
        })
        .then(result => res.send({ count: result }))
        .catch(err => console.log("_-------", err))
}

const updateVoter = (req, res) => {
    let voter_id = req.query.id;
    let voter_name = req.query.name;

    VOTERS.update({
        voter_name: voter_name
    }, {
        where: {
            id: voter_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Voter updated' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Voter not updated' });
    })
}

const deleteVoter = (req, res) => {
    let voter_id = req.query.id;
    VOTERS.destroy({
        where: {
            id: voter_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Voter deleted' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Voter not deleted' });
    })
}

const validateVoterData = (data) => {
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

const queryVoters = async(election_id, callback) => {
    if (election_id) {
        VOTERS
            .findAndCountAll({
                where: {
                    election_id: election_id
                },
                // attributes: ['id', 'voter_name']
            })
            .then(result => {
                console.log(result);
                // let results = [];
                // result.forEach(ele => {
                //     results.push(ele.dataValues);
                // })

                // return callback(results);
            })
            .catch(err => {
                console.log("_---------------", err);
            })
    } else {
        VOTERS
            .findAll({
                where: { status: 'active' },
                attributes: ['id', 'voter_name']
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
    votersRegistrationView,
    createVoter,
    getVoters,
    updateVoter,
    deleteVoter,
    getVoterCounts
}