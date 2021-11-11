const USERS = require('../models/tables').USERS;
let res_obj = {
    code: 0,
    msg: "successful"
}

const loginForm = (req, res) => {
    res.render('auth/login');
}

const loginDetails = async(req, res) => {
    let res_obj = {
        code: 0,
        msg: 'active user'
    }

    getUsers(req.body, result => {
        if (result.status !== 'active') {
            res_obj.code = 1;
            res_obj.msg = 'not active user';
        }

        res.send(res_obj)
    })
}

const getUsers = (data, callback) => {
    USERS.findAll({
            attributes: ['email', 'password', 'status'],
            where: {
                email: data.email,
                password: data.password
            }
        })
        .then(response => {
            if (response.length > 0) {
                return callback(response[0].dataValues);
            } else {
                return callback(response);
            }
        })
        .catch(err => {
            return callback(err.message);
        })
}

const signUpForm = (req, res) => {
    res.render('auth/register');
}

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

const getJobs = async(req, res) => {
    let auth_result = await auth(req.query);

    if (auth_result) {
        db.all(`SELECT * FROM jobs`, (err, data) => res.send(data))
    } else {
        res_obj.code = 401;
        res_obj.msg = "Sorry! Unauthorized step taken";
        res.send(res_obj);
    }
}

const createJob = async(req, res) => {
    let title = req.body.title;
    let job_link = req.body.job_link;
    let end_date = req.body.end_date;

    await Job
        .findOrCreate({ where: { title: title, job_link: job_link, end_date: end_date } })
        .then(suc => {
            if (!suc[1]) {
                res_obj.code = 1;
                res_obj.msg = "Job already exist";
            }
        })
        .catch(err => {
            res_obj.code = 1;
            res_obj.msg = "Job not entered";
            res_obj.error_msg = err.message;
        })

    res.send(res_obj);
}

const editJob = (req, res) => {
    let job_id = req.query.id;
    let title = req.body.title.trim();
    let job_link = req.body.job_link.trim();
    let end_date = req.body.end_date.trim();

    if (checkLength(title) > 0 && checkLength(job_link) > 0 && checkLength(end_date) > 0) {
        db.run(`UPDATE jobs SET title = ?, job_links = ?, end_date = ? WHERE id = ?;`, title, job_link, end_date, job_id, (err) => {
            if (!err) {
                res.send({ status: 0, msg: 'Job updated' });
            } else {
                res.send({ status: 1, msg: 'Job not updated' });
            }
        });
    } else {
        db.run(`UPDATE jobs SET title = ? WHERE id = ?;`, title, job_id, (err) => {
            if (!err) {
                res.send({ status: 0, msg: 'Job title updated' });
            } else {
                res.send({ status: 1, msg: 'Job title not updated' });
            }
        });
    }
}

const deleteJob = async(req, res) => {
    let auth_result = await auth(req.query);

    if (auth_result) {
        let job_id = req.query.id;
        db.run(`DELETE FROM jobs WHERE id = ?;`, job_id, (err) => {
            if (!err) {
                res.send({ status: 0, msg: 'Job deleted' });
            } else {
                res.send({ status: 1, msg: 'Job not deleted' });
            }
        });
    } else {
        res_obj.code = 401;
        res_obj.msg = "Sorry! Unauthorized step taken";
    }

    res.send(res_obj);
}

module.exports = {
    loginForm,
    loginDetails,
    signUpForm,
    saveSignUpForm
}