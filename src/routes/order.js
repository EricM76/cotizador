const express = require('express');
const router = express.Router();

const {index,add,preview,store,send,detail,edit,update,remove} = require('../controllers/orderController');

router
    .get('/', index)
    .get('/add',add)
    .get('/preview',preview)
    .post('/add',store)
    .post('/send', send)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',update)
    .delete('/remove/:id',remove)

module.exports = router;