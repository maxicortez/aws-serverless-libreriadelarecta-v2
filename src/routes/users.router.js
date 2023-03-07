const { Router } = require('express');
const router = Router();

const { validateToken } = require('../services/jwt')
const { login, getMe, getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/users.controllers');

router.post('/auth/login', login);
router.get('/api/me', validateToken, getMe);
router.get('/api/users', validateToken, getUsers);
router.get('/api/users/:id', validateToken, getUserById);
router.post('/api/users', validateToken, createUser);
router.put('/api/users/:id', validateToken, updateUser)
router.delete('/api/users/:id', validateToken, deleteUser);

module.exports = router;