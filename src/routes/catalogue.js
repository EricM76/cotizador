const express = require('express');
const router = express.Router();

const {index} = require('../controllers/catalogueController');

router
    .get('/', index)

module.exports = router;
