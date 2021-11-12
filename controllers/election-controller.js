const ELECTIONS = require('../models/table').ELECTIONS;

const createElection = (req, res) => {
    let election_name = req.query.name.trim();
    req.session.userID = "f759fa54-6640-416a-a01c-9e1ae1b1fd21";
    req.session.role = "superadmin";
    // console.log(req.session.userID);
    let userID = req.session.userID;
    console.log("ID**********************", userID);

    if (election_name.length > 0) {
        // .findOrCreate({
        //     where: {
        //         email: "emmanuel@gmail.com"
        //     },
        //     defaults: {
        //         first_name: "Emmanuel",
        //         last_name: "Jaygbay",
        //         email: "emmanuel@gmail.com",
        //         password: "secret",
        //         role_id: role_id
        //     }
        // })

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
                console.log("RESULTTTTTTTT===========", typeof result[1]);
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

const getElections = (req, res) => {
    if (req.query.id) {
        let election_id = req.query.id;
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
            // db.all(`SELECT * FROM elections WHERE id = ?`, election_id, (err, data) => {
            //     !err ? res.send(data) : res.send(err);
            // });
    } else {
        ELECTIONS
            .findAll({
                where: { status: 'active' },
                attributes: ['id', 'election_name']
            })
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })

        // db.all("SELECT * FROM elections;", (err, data) => {
        //     !err ? res.send(data) : res.send(err);
        // });
    }
}

const updateElection = (req, res) => {
    db.run(`UPDATE elections SET election_name = ? WHERE id = ?;`, req.query.name, req.query.id, (err) => {
        if (!err) {
            res.send({ status: 0, msg: 'Election updated' });
        } else {
            res.send({ status: 1, msg: 'Election not updated' });
        }
    });
}

const deleteElection = (req, res) => {
    let election_id = req.query.id;
    db.run(`DELETE FROM elections WHERE id = ?;`, election_id, (err, err2) => {
        if (!err) {
            res.send({ status: 0, msg: 'Election deleted' });
        } else {
            res.send({ status: 1, msg: 'Election not deleted' });
        }
    });
}

module.exports = {
    createElection,
    getElections,
    updateElection,
    deleteElection
}