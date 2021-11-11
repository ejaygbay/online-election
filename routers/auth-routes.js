const routers = require('express').Router();
const authController = require('../controllers/auth-controllers');

routers.get('/login', authController.loginForm);

routers.post('/login', authController.loginDetails)

routers.get('/account/create', authController.signUpForm);

routers.post('/account/create', authController.saveSignUpForm);

module.exports = routers;