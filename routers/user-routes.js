const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user-controller');

router.get('/user/create', userControllers.getUserView);

router.post('/user', userControllers.createUser);

router.get('/user', userControllers.getUsers);

router.patch('/user', userControllers.updateUser);

router.delete('/user', userControllers.deleteUser);

module.exports = router;