const { Router } = require('express');
const router = Router();
const { validateToken } = require('../services/jwt')
const { getInfo, testSQL, testFunctions } = require('../controllers/info.controllers');

router.get('/api/info', getInfo);
router.get('/api/testsql', validateToken, testSQL);
router.get('/api/testfunctions', validateToken, testFunctions);
router.post('/api/testfunctions', testFunctions);

module.exports = router;