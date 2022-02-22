const express = require('express');
const router = express.Router();

const {backout,width,search} = require('../controllers/informationController');

router
    .get('/backout', backout)
    .get('/cloth-width', width)
    .get('/cloth-width/search',search)

module.exports = router;
