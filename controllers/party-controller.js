const PARTY = require('../models/table').PARTY;

const getPartyView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('party', { page: 'party', role: role });
    } else {
        res.redirect('/login');
    }
}

const createParty = (req, res) => {
    let party_name = req.query.name.trim();
    let election_id = req.query.id.trim();
    let userID = req.session.userID;

    if (userID) {
        if (!election_id) {
            election_id = req.session.electionID;
        }

        if (party_name.length > 0) {
            PARTY
                .findOrCreate({
                    where: {
                        party_name: party_name,
                        election_id: election_id
                    },
                    defaults: {
                        user_id: userID,
                        election_id: election_id,
                        party_name: party_name
                    }
                })
                .then(result => {
                    if (result[1] === true) {
                        res.send({ status: 0, msg: 'Party created' });
                    } else {
                        res.send({ status: 1, msg: 'Party already exists' });
                    }
                })
                .catch(err => {
                    console.log("ERRORRRR>>>>>>>>>>>>>", err.message);
                    res.send({ status: 1, msg: 'Party not created' });
                })
        } else {
            res.send({ status: 1, msg: 'Invalid party name' })
        }
    } else {
        res.send("You are not authorized");
    }
}

const getParties = async(req, res) => {
    let election_id = req.query.election_id;

    if (req.session.role === "admin") {
        election_id = req.session.electionID;
    }

    queryParties(election_id, data => {
        res.send(data);
    })
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

const queryParties = async(election_id, callback) => {
    if (election_id === 'Independent') {
        PARTY
            .findOne({
                attributes: ['id', 'party_name'],
                where: { party_name: 'Independent' }
            })
            .then(result => {
                let results = [];
                results.push(result.dataValues);
                return callback(results);
            })
            .catch(err => {
                return callback({ status: 1, message: 'election id not found' });
            })
    } else if (election_id) {
        PARTY
            .findAll({
                where: { election_id: election_id, status: 'active' }
            })
            .then(result => {
                let results = [];
                result.forEach(ele => {
                    results.push(ele.dataValues);
                })
                return callback(results);
            })
            .catch(err => {
                return callback({ status: 1, message: 'election id not found' });
            })
    } else {
        PARTY
            .findAll({
                where: { status: 'active' },
                attributes: ['id', 'party_name']
            })
            .then(result => {
                let results = [];
                result.forEach(ele => {
                    results.push(ele.dataValues);
                })
                return callback(results);
            })
            .catch(err => {
                return callback({ status: 1, message: 'election id not found' });
            })
    }
}

// queryParties();

module.exports = {
    getPartyView,
    createParty,
    getParties,
    updateParty,
    deleteParty
}