const express = require('express');
const router = express.Router();

const { index, register, processRegister, login, processLogin, credentials, profile, update, remove, filter, enable } = require('../controllers/userController');

router
    .get('/', index)
    .get('/register', register)
    .post('/register', processRegister)
    .get('/login', login)
    .post('/login', processLogin)
    .get('/credentials',credentials)
    .get('/profile/:id', profile)
    .put('/update/:id', update)
    .delete('/remove/:id', remove)
    .get('/filter', filter)

    /* apis */
    .post('/api/enable', enable)

module.exports = router;