const {check} = require('express-validator');
const db = require('../database/models');


module.exports = [
   check('name','El nombre es obligatorio').notEmpty(),
   check('surname', 'El apellido es obligatorio').notEmpty(),
   check('email','El email es obligatorio').isEmail()
]