const express = require('express');
const router = express.Router();

const {backout,width,search, getPackaging, updatePackaging} = require('../controllers/informationController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');

router
    .get('/backout', backout)
    .get('/cloth-width', width)
    .get('/cloth-width/search',search)
    .get('/get-packaging',getPackaging)
    .put('/update-packaging',adminSessionCheck, updatePackaging)

module.exports = router;
