const express = require('express');
const router = express.Router();
const positionControllers = require('../controllers/position-controller');

router.get('/position/create', positionControllers.getPositionView);

router.post('/position', positionControllers.createPosition);

router.get('/position', positionControllers.getPositions);

router.patch('/position', positionControllers.updatePosition);

router.delete('/position', positionControllers.deletePosition);

module.exports = router;