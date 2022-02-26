const express = require('express');
const router = express.Router();

const {backout,clothWidth} = require('../controllers/informationController');

router
    .get('/backout', backout)
    .get('/cloth-width', clothWidth)
   

module.exports = router;
