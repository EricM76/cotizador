const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove,filter,visibility} = require('../controllers/colorController');

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

module.exports = router;