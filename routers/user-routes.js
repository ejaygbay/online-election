const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user-controller');

router.get('/user/create', userControllers.getPositionView);

router.post('/user', userControllers.createPosition);

router.get('/user', userControllers.getPositions);

router.patch('/user', userControllers.updatePosition);

router.delete('/user', userControllers.deletePosition);

module.exports = router;