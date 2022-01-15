var express = require('express');
var router = express.Router();

const {form} = require('../controllers/quoterController')

router
  .get('/', form);

module.exports = router;
