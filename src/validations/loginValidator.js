const {body} = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../database/models');


module.exports = [
    body('username')
    .custom((value,{req}) => {
        return db.User.findOne({
            where :{
                username : value,
                enabled : true
            }
        }).then(user => {
            if(!user || !bcrypt.compareSync(req.body.password,user.password)){
                return Promise.reject()
            }
        }).catch( () => Promise.reject('Credenciales inválidas'))
    })
]