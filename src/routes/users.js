const express = require('express');
const router = express.Router();

const { index, add, store, login, processLogin, edit, update, remove, filter, enable, logout, verifyUsername, getIdsLocal } = require('../controllers/userController');
const loginValidator = require('../validations/loginValidator');
const registerValidator = require('../validations/registerValidator');
const adminSessionCheck = require('../middlewares/adminSessionCheck');

router
    .get('/', index)
    .get('/add',adminSessionCheck, add)
    .post('/store',adminSessionCheck,registerValidator, store)
    .get('/login', login)
    .post('/login',loginValidator, processLogin)
    .get('/logout',logout)
    .get('/edit/:id',adminSessionCheck, edit)
    .put('/update/:id',adminSessionCheck, update)
    .delete('/remove/:id',adminSessionCheck, remove)
    .get('/filter', filter)

    /* apis */
    .post('/api/enable', enable)
    .post('/api/verify-username',verifyUsername)
    .get('/api/get-ids-local',adminSessionCheck,getIdsLocal)


module.exports = router;