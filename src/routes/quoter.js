const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove,search,load,quote, filter,getUsers} = require('../controllers/quoterController');

const {userSessionCheck} = require('../middlewares') 

/* quoters */
router
    .get('/', index)
    .get('/add', userSessionCheck,add)
    .post('/add',store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',update)
    .delete('/remove/:id',remove)
    .get('/search',search)
    .get('/filter',filter)
    
    /* apis */
    .get('/api/load/:id',load)
    .post('/api/quote',quote)
    .post('/api/users',getUsers)

module.exports = router;