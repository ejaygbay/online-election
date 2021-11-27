const ROLES = require('../models/table').ROLES;

const getRoles = (req, res) => {
    if (req.query.id) {
        queryRoles(req.query.id, data => {
            res.send(data);
        })
    } else {
        queryRoles(null, data => {
            res.send(data);
        })
    }
}


const queryRoles = async(election_id, callback) => {
    if (election_id) {
        ROLES
            .findAll({
                where: {
                    election_id: election_id
                },
                attributes: ['id', 'role']
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
        ROLES
            .findAll({
                attributes: ['id', 'role']
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

module.exports = getRoles;