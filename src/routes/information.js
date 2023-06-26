const express = require('express');
const router = express.Router();

const {backout,width,search, getPackaging, updatePackaging, updatePercentageLineBlack, getPercentageLineBlack} = require('../controllers/informationController');
const adminSessionCheck = require('../middlewares/adminSessionCheck');

router
    .get('/backout', backout)
    .get('/cloth-width', width)
    .get('/cloth-width/search',search)
    .get('/get-packaging',getPackaging)
    .put('/update-packaging',adminSessionCheck, updatePackaging)
    .get('/get-percentage-lineblack',getPercentageLineBlack)
    .put('/update-percentage-lineblack', adminSessionCheck, updatePercentageLineBlack)

module.exports = router;
