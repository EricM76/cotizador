const express = require('express');
const router = express.Router();

const {index,add,preview,store,detail,edit,update,remove} = require('../controllers/orderController');

router
    .get('/', index)
    .get('/add',add)
    .post('/add',store)
    .get('/preview',preview)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',update)
    .delete('/remove/:id',remove)

module.exports = router;