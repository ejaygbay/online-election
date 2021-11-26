const CONTESTANTS = require('../models/table').CONTESTANTS;

const getContestantView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('contestant', { page: 'contestant', role: role });
    } else {
        res.redirect('/login');
    }
}

const createContestant = (req, res) => {
    req.session.userID = "f759fa54-6640-416a-a01c-9e1ae1b1fd21";
    req.session.electionID = "8c25132a-5e69-4572-8944-565d5c0eabc6";
    req.session.role = "superadmin";

    let role = req.session.role;
    let user_id = req.session.userID;
    let election_id = req.session.electionID;

    let first_name = req.body.first_name;
    let middle_name = req.body.middle_name;
    let last_name = req.body.last_name;
    let position_id = req.body.position_id;
    let party_id = req.body.party_id;
    let contestant_img = req.body.contestant_img;

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

const getContestants = (req, res) => {
    if (req.query.id) {
        queryContestants(req.query.id, data => {
            res.send(data);
        })
    } else {
        queryContestants(null, data => {
            res.send(data);
        })
    }
}

const updateContestant = (req, res) => {
    let contestant_id = req.query.id;
    let contestant_name = req.query.name;

    CONTESTANTS.update({
        contestant_name: contestant_name
    }, {
        where: {
            id: contestant_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Contestant updated' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Contestant not updated' });
    })
}

const deleteContestant = (req, res) => {
    let contestant_id = req.query.id;
    CONTESTANTS.destroy({
        where: {
            id: contestant_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Contestant deleted' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Contestant not deleted' });
    })
}

const validateContestantData = (data) => {
    let count = 0;
    for (let items in data) {
        if (data[items].length < 1) {
            count++;
            break;
        }
    }

    console.log("Validate Data:", data);
    console.log("Count::", count);

    if (count > 0)
        return false
    else
        return true;
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

const queryContestants = async(election_id, callback) => {
    if (election_id) {
        CONTESTANTS
            .findAll({
                where: {
                    election_id: election_id
                },
                attributes: ['id', 'contestant_name']
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
        CONTESTANTS
            .findAll({
                where: { status: 'active' },
                attributes: ['id', 'contestant_name']
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
    getContestantView,
    createContestant,
    getContestants,
    updateContestant,
    deleteContestant
}