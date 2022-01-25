const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove,filter,visibility, getAll} = require('../controllers/systemController');

router
    .get('/', index)
    .get('/add',add)
    .post('/add',store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',update)
    .delete('/remove/:id',remove)
    .get('/filter',filter)
    .post('/api/visibility/:id/:visibility',visibility)
    //apis
    .get('/api/get-all',getAll)

module.exports = router;