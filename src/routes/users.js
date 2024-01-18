const express = require('express');
const router = express.Router();

const { index, add, store, login, processLogin, edit, update, remove, restore, filter, enable, logout, verifyUsername, getIdsLocal, changeAllViewOrders, changeViewOrders, onInfinity} = require('../controllers/userController');
const loginValidator = require('../validations/loginValidator');
const registerValidator = require('../validations/registerValidator');
const adminSessionCheck = require('../middlewares/adminSessionCheck');
const controlSessionCheck = require('../middlewares/controlSessionCheck');
const userSessionCheck = require('../middlewares/userSessionCheck');

router
    .get('/',userSessionCheck, controlSessionCheck, index)
    .get('/add',adminSessionCheck, add)
    .post('/store',adminSessionCheck,registerValidator, store)
    .get('/login', login)
    .post('/login',loginValidator, processLogin)
    .get('/logout',logout)
    .get('/edit/:id',adminSessionCheck, edit)
    .put('/update/:id',adminSessionCheck, update)
    .delete('/remove/:id',adminSessionCheck, remove)
    .get('/filter', filter)
    .get('/restore/:id', adminSessionCheck, restore)

    /* apis */
    .post('/api/enable', enable)
    .post('/api/infinity', onInfinity)
    .post('/api/verify-username',verifyUsername)
    .get('/api/get-ids-local',adminSessionCheck,getIdsLocal)
    .post('/api/view-all-orders',adminSessionCheck,changeAllViewOrders)
    .post('/api/change-view-orders',adminSessionCheck,changeViewOrders)


module.exports = router;