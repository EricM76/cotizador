const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove,filter,visibility, getAll,buy,sendBuy} = require('../controllers/accessoryController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');
const upLoadTicket = require('../middlewares/upLoadTicket')


router
    .get('/', index)
    .get('/add',add)
    .post('/add',adminSessionCheck,store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',adminSessionCheck,update)
    .delete('/remove/:id',adminSessionCheck,remove)
    .get('/filter',filter)
    .get('/buy',buy)
    .post('/send-buy',upLoadTicket.single('ticket'),sendBuy)
    //apis
    .get('/api/get-all',getAll)
    .post('/api/visibility/:id/:visibility',adminSessionCheck,visibility)
   


module.exports = router;