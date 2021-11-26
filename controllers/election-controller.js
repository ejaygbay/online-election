const ELECTIONS = require('../models/table').ELECTIONS;

const getElectionView = (req, res) => {
    let userID = req.session.userID;
    let role = req.session.role;

    if (userID && role) {
        res.render('election', { page: 'election', role: role });
    } else {
        res.render('login', { page: 'login' });
    }
}

const createElection = (req, res) => {
    let election_name = req.query.name.trim();
    req.session.userID = "f759fa54-6640-416a-a01c-9e1ae1b1fd21";
    req.session.role = "superadmin";
    let userID = req.session.userID;
    console.log("ID**********************", userID);

    if (election_name.length > 0) {
        ELECTIONS
            .findOrCreate({
                where: {
                    election_name: election_name
                },
                defaults: {
                    user_id: userID,
                    election_name: election_name
                }
            })
            .then(result => {
                if (result[1] === true) {
                    res.send({ status: 0, msg: 'Election created' });
                } else {
                    res.send({ status: 1, msg: 'Election already exists' });
                }
            })
            .catch(err => {
                console.log("ERRORRRR>>>>>>>>>>>>>", err);
                res.send({ status: 1, msg: 'Election not created' });
            })
    } else {
        res.send({ status: 1, msg: 'Invalid election name' })
    }
}

const getElections = async(req, res) => {
    console.log("Get Elections ====================");
    if (req.query.id) {
        queryElections(req.query.id, data => {
            res.send(data);
        })
    } else {
        queryElections(null, data => {
            res.send(data);
        })
    }
}

const updateElection = (req, res) => {
    let election_id = req.query.id;
    let election_name = req.query.name;

    ELECTIONS.update({
        election_name: election_name
    }, {
        where: {
            id: election_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Election updated' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Election not updated' });
    })
}

const deleteElection = (req, res) => {
    let election_id = req.query.id;

    ELECTIONS.destroy({
        where: {
            id: election_id
        }
    }).then(() => {
        res.send({ status: 0, msg: 'Election deleted' });
    }).catch(error => {
        res.send({ status: 1, msg: 'Election not deleted' });
    })
}

const queryElections = async(election_id, callback) => {
    if (election_id) {
        ELECTIONS
            .findOne({
                where: { id: election_id, status: 'active' }
            })
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        ELECTIONS
            .findAll({
                where: { status: 'active' },
                attributes: ['id', 'election_name']
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

// queryElections();

module.exports = {
    getElectionView,
    createElection,
    getElections,
    updateElection,
    deleteElection
}