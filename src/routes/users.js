const express = require('express');
const router = express.Router();

const { index, add, store, login, processLogin, edit, update, remove, filter, enable, logout } = require('../controllers/userController');
const loginValidator = require('../validations/loginValidator');
const registerValidator = require('../validations/registerValidator');

router
    .get('/', index)
    .get('/add', add)
    .post('/store',registerValidator, store)
    .get('/login', login)
    .post('/login',loginValidator, processLogin)
    .get('/logout',logout)
    .get('/edit/:id', edit)
    .put('/update/:id', update)
    .delete('/remove/:id', remove)
    .get('/filter', filter)

    /* apis */
    .post('/api/enable', enable)

module.exports = router;