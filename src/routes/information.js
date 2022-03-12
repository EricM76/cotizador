const express = require('express');
const router = express.Router();

const {backout,width,search, getPackaging, updatePackaging} = require('../controllers/informationController');

router
    .get('/backout', backout)
    .get('/cloth-width', width)
    .get('/cloth-width/search',search)
    .get('/get-packaging',getPackaging)
    .put('/update-packaging',updatePackaging)

module.exports = router;
