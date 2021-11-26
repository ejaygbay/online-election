const PARTY = require('../models/table').PARTY;

const getPartyView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('party', { page: 'party', role: role });
    } else {
        res.render('login', { page: 'login' });
    }
}

const createParty = (req, res) => {
    let party_name = req.query.name.trim();
    req.session.userID = "f759fa54-6640-416a-a01c-9e1ae1b1fd21";
    req.session.electionID = "8c25132a-5e69-4572-8944-565d5c0eabc6";
    req.session.role = "superadmin";
    let userID = req.session.userID;
    let electionID = req.session.electionID;

    if (party_name.length > 0) {
        PARTY
            .findOrCreate({
                where: {
                    party_name: party_name
                },
                defaults: {
                    user_id: userID,
                    election_id: electionID,
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
                console.log("ERRORRRR>>>>>>>>>>>>>", err);
                res.send({ status: 1, msg: 'Party not created' });
            })
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

const queryParties = async(party_id, callback) => {
    if (party_id) {
        PARTY
            .findOne({
                where: { id: party_id, status: 'active' }
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