const express = require('express');
const router = express.Router();

const {backout} = require('../controllers/informationController');

router
    .get('/backout', backout)
   

module.exports = router;
