const USERS = require('../models/table').USERS;
const ROLES = require('../models/table').ROLES;

let res_obj = {
    code: 0,
    msg: "successful"
}

const loginForm = (req, res) => res.render('./login', { page: 'login' });

const loginDetails = async(req, res) => {
    let res_obj = {
        code: 0,
        msg: 'active user'
    }

    getUsers(req.body, result => {
        if (result.id) {
            req.session.userID = result.id;
            req.session.electionID = result.election_id;
            req.session.roleID = result.role.dataValues.id;
            req.session.role = result.role.dataValues.role;
        } else {
            res_obj.code = 1;
            res_obj.msg = 'not active user';
        }
        res.send(res_obj)
    })
}

const logOut = (req, res) => req.session.destroy((err) => res.redirect('/login'));

const signUpForm = (req, res) => res.render('./register', { page: 'register' });

const saveSignUpForm = async(req, res) => {
    await USERS.findOrCreate({
            where: { email: req.body.email },
            defaults: req.body
        })
        .then(response => {
            if (!response[1]) {
                res_obj.code = 2;
                res_obj.msg = "email aleready exists";
            }
        })
        .catch(error => {
            res_obj.code = 1;
            res_obj.msg = "failed";
            res_obj.err_msg = error.message;
        })

    res.send(res_obj);
}

const getUsers = (data, callback) => {
    USERS.findAll({
            include: [ROLES],
            where: {
                email: data.email,
                password: data.password,
                status: 'active'
            }
        })
        .then(response => {
            if (response.length > 0) {
                return callback(response[0].dataValues);
            } else {
                return callback({ code: 1, message: 'user not found' });
            }
        })
        .catch(err => {
            return callback(err.message);
        })
}

module.exports = {
    loginForm,
    loginDetails,
    logOut,
    signUpForm,
    saveSignUpForm
}