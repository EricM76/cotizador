const express = require('express');
const router = express.Router();

const {index,editAll, editItem, add,store,detail,edit,update,remove, getDataBySystem, getPrice} = require('../controllers/priceController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');

router
    .get('/', index)
    .get('/edit/all',editAll)
    .get('/edit/item',editItem)
    .get('/add',add)
    .post('/add',adminSessionCheck,store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update',adminSessionCheck,update)
    /* apis */
    .delete('/api/remove',adminSessionCheck,remove)
    .get('/api/get-data-by-system/:system',adminSessionCheck,getDataBySystem)
    .post('/api/get-price',adminSessionCheck,getPrice)


module.exports = router;