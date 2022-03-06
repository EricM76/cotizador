const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove,filter,visibility} = require('../controllers/chainController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');

router
    .get('/', index)
    .get('/add',add)
    .post('/add',adminSessionCheck, store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',adminSessionCheck,update)
    .delete('/remove/:id',adminSessionCheck,remove)
    .get('/filter',filter)
    .post('/api/visibility/:id/:visibility',adminSessionCheck,visibility)

module.exports = router;
