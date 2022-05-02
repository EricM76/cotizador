const express = require('express');
const router = express.Router();

const {index,editAll, add,store,detail,edit,update,remove, getDataBySystem, getPrice, getIdsLocal, filter, visibility, removeItem, updateItem, editItem} = require('../controllers/priceController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');

router
    .get('/', index)
    .get('/edit/all',editAll)
    .get('/edit/item',edit)
    .get('/edit/:id',editItem)
    .get('/add',add)
    .post('/add',adminSessionCheck,store)
    .get('/detail/:id',detail)
    .put('/update',adminSessionCheck,update)
    .put('/update/:id',adminSessionCheck,updateItem)
    /* apis */
    .get('/api/filter/:system/:cloth?/:color?',filter)
    .post('/api/visibility/:id',adminSessionCheck,visibility)
    .delete('/api/remove',adminSessionCheck,remove)
    .delete('/api/remove-item',adminSessionCheck,removeItem)
    .get('/api/get-data-by-system/:system',adminSessionCheck,getDataBySystem)
    .post('/api/get-price',adminSessionCheck,getPrice)
    .get('/api/get-ids-local',adminSessionCheck,getIdsLocal)


module.exports = router;