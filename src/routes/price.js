const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove} = require('../controllers/priceController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');

router
    .get('/', index)
    .get('/add',add)
    .post('/add',adminSessionCheck,store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',adminSessionCheck,update)
    .delete('/remove/:id',adminSessionCheck,remove)

module.exports = router;