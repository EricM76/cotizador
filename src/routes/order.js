const express = require('express');
const router = express.Router();

const {index,add,preview,store,send,detail,edit,update,remove, download, filter, addAccessories, reSend, onCancel} = require('../controllers/orderController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');
const upLoadTicket = require('../middlewares/upLoadTicket')

/* /orders */
router
    .get('/', index)
    .get('/add',add)
    .get('/preview',preview)
    .post('/add', store)
    .post('/send',upLoadTicket.single('ticket'), send)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',update)
    .delete('/remove/:id',adminSessionCheck,remove)
    .get('/download', download)
    .get('/filter', filter)
    /* apis */
    .post('/api/add-accessories',addAccessories)
    .post('/api/resend',reSend)
    .post('/api/oncancel',onCancel)


module.exports = router;