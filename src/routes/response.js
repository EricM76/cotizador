const express = require('express');
const router = express.Router();

const {sendOrder} = require('../controllers/responseController');

router
    .get('/send-order', sendOrder)
   

module.exports = router;