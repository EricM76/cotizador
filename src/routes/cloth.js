const express = require('express');
const router = express.Router();

const {index,add,store,detail,edit,update,remove,filter,visibility, getIdsLocal, getClothByPk} = require('../controllers/clothController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');


router
    .get('/', index)
    .get('/add',add)
    .post('/add',adminSessionCheck,store)
    .get('/detail/:id',detail)
    .get('/edit/:id',edit)
    .put('/update/:id',adminSessionCheck,update)
    .delete('/remove/:id',adminSessionCheck,remove)
    .get('/filter',filter)
    /* apis */
    .post('/api/visibility/:id/:visibility',adminSessionCheck,visibility)
    .get('/api/get-ids-local',adminSessionCheck,getIdsLocal)
    .get('/api/:id',getClothByPk)

module.exports = router;