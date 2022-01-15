const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove} = require('../controllers/patternController');

router
    .get('/', index)
    .get('/add',add)
    .post('/add',store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',update)
    .delete('/remove/:id',remove)

module.exports = router;