const express = require('express');
const router = express.Router();

const {index,add,preview,store,send,detail,edit,update,remove, download, filter} = require('../controllers/orderController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');

router
    .get('/', index)
    .get('/add',add)
    .get('/preview',preview)
    .post('/add',store)
    .post('/send', send)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',update)
    .delete('/remove/:id',adminSessionCheck,remove)
    .get('/download',adminSessionCheck, download)
    .get('/filter',adminSessionCheck, filter)


module.exports = router;