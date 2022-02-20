const express = require('express');
const router = express.Router();

const {catalogue,manual} = require('../controllers/informationController');

router
    .get('/catalogue', catalogue)
    .get('/manual', manual)

module.exports = router;
