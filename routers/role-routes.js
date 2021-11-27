const express = require('express');
const router = express.Router();
const roleControllers = require('../controllers/role-controller');

router.get('/role', roleControllers.getRoles);

module.exports = router;