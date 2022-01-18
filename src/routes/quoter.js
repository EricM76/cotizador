const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove,search,load,quote} = require('../controllers/quoterController');

router
    .get('/', index)
    .get('/add',add)
    .post('/add',store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',update)
    .delete('/remove/:id',remove)
    .get('/search',search)
    
    /* apis */
    .get('/api/load/:id',load)
    .post('/api/quote',quote)

module.exports = router;