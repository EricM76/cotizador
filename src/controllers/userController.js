const bcrypt = require('bcryptjs');
const db = require('../database/models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

module.exports = {
    index: async (req, res) => {
        let total = await db.User.count({
            where: { enabled: true }
        })
        db.User.findAll({
            where: {
                enabled: true,
            },
            limit: 8,
            include: { all: true }
        })
            .then(items => {
                return res.render('users', {
                    items,
                    total,
                    active: 1,
                    pages: 1,
                    keywords: "",
                    multiplo: total % 8 === 0 ? 0 : 1
                })
            })
            .catch(error => console.log(error))
    },
    add: (req, res) => {
        db.Rol.findAll()
            .then(rols => {
                return res.render('userAdd', {
                    rols
                })
            })
            .catch(error => console.log(error))
    },
    store: (req, res) => {

        const errors = validationResult(req);
        const { name, surname, rolId, idLocal, enabled, email, phone, username, password } = req.body;
        if (errors.isEmpty()) {

            db.User.create({
                name: name.trim(),
                surname: surname.trim(),
                rolId: rolId ? +rolId : 3,
                idLocal: idLocal ? idLocal : null,
                enabled: enabled ? true : false,
                email,
                phone,
                username,
                password: bcrypt.hashSync(password, 10)

            }).then(user => {
                console.log(`El usuario ${user.name} ha sido guardado con éxito`);
                return res.redirect('/users')
            }).catch(error => console.log(error))

        } else {
            db.Rol.findAll()
                .then(rols => {
                    return res.render('userAdd', {
                        errors: errors.mapped(),
                        old: req.body,
                        rols
                    })
                })
                .catch(error => console.log(error))
        }
    },
    edit: (req, res) => {

        let user = db.User.findByPk(req.params.id, {
            include: { all: true }
        })

        let rols = db.Rol.findAll()

        Promise.all([user, rols])
            .then(([user, rols]) => {
                return res.render('userEdit', {
                    user,
                    rols
                })
            })
            .catch(error => console.log(error))

    },
    update: async (req, res) => {

        const errors = validationResult(req);
        const { name, surname, rolId, idLocal, enabled, email, phone, username, password } = req.body;
        if (errors.isEmpty()) {
            let user = await db.User.findByPk(req.params.id)
            db.User.update(
                {
                    name,
                    surname,
                    email,
                    rolId: +rolId,
                    idLocal : idLocal ? idLocal : null,
                    enabled: enabled ? 1 : 0,
                    phone,
                    username,
                    password: password ? bcrypt.hashSync(password, 10) : user.password
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            ).then(() => {
                console.log(`El usuario ${name} ha sido actualizado con éxito`);
                return res.redirect('/users')
            }).catch(error => console.log(error))
        } else {
            let user = db.User.findByPk(req.params.id, {
                include: { all: true }
            })

            let rols = db.Rol.findAll()

            Promise.all([user, rols])
                .then(([user, rols]) => {
                    return res.render('userEdit', {
                        user,
                        rols,
                        errors: errors.mapped()
                    })
                })
                .catch(error => console.log(error))

        }

    },
    remove: (req, res) => {
        res.render('users')
    },
    search: (req, res) => {
        res.render('users')
    },
    filter: async (req, res) => {

        let { order, filter, keywords, active, pages } = req.query;
        let items = [];
        let total = 0;
        try {
            if (filter === "all") {
                total = await db.User.count({
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.substring]: keywords
                                }
                            },
                            {
                                surname: {
                                    [Op.substring]: keywords
                                }
                            },
                            {
                                username: {
                                    [Op.substring]: keywords
                                }
                            }
                        ]
                    },
                })
                items = await db.User.findAll({
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.substring]: keywords
                                }
                            },
                            {
                                surname: {
                                    [Op.substring]: keywords
                                }
                            },
                            {
                                username: {
                                    [Op.substring]: keywords
                                }
                            }
                        ]
                    },
                    include: { all: true },
                    order: [order || 'id'],
                    limit: 8,
                    offset: active && (+active * 8) - 8
                })
            } else {
                total = await db.User.count({
                    where: {
                        enabled: filter || true,
                        [Op.or]: [
                            {
                                name: {
                                    [Op.substring]: keywords
                                }
                            },
                            {
                                surname: {
                                    [Op.substring]: keywords
                                }
                            },
                            {
                                username: {
                                    [Op.substring]: keywords
                                }
                            }
                        ]
                    },
                })
                items = await db.User.findAll({
                    where: {
                        enabled: filter || true,
                        [Op.or]: [
                            {
                                name: {
                                    [Op.substring]: keywords
                                }
                            },
                            {
                                surname: {
                                    [Op.substring]: keywords
                                }
                            },
                            {
                                username: {
                                    [Op.substring]: keywords
                                }
                            }
                        ]
                    },
                    include: { all: true },
                    order: [order || 'id'],
                    limit: 8,
                    offset: active && (+active * 8) - 8

                })
            }
            return res.render('users', {
                items,
                total,
                active,
                pages,
                keywords,
                multiplo: total % 8 === 0 ? 0 : 1
            })
        } catch (error) {
            console.log(error)
        }
    },
    enable: async (req, res) => {

        const { id, enable } = req.body;

        try {

            await db.User.update(
                { enabled: enable === true ? 0 : 1 },
                { where: { id } }
            )

            return res.status(200).json({
                ok: true,
                msg: 'Habilitación modificada con éxito!'
            })

        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.status === 500 ? "Comuníquese con el administrador del sitio" : error.message
            })
        }
    },
    login: (req, res) => {
        res.render('login')
    },
    processLogin: async (req, res) => {
        const errors = validationResult(req);
        const { username } = req.body;
        if (errors.isEmpty()) {

            try {
                let user = await db.User.findOne({
                    where: {
                        username,
                    },
                    include : [
                        {association : 'rol'}
                    ]
                })
                req.session.userLogin = {
                    id : user.id,
                    name: user.name,
                    username : user.username,
                    email : user.email,
                    rol: +user.rolId,
                    rolName : user.rol.name.toLowerCase(),
                    coefficient : +user.rol.coefficient
                }

                /* req.session.packaging = require('../data/packaging.json') */

                return res.redirect('/quoters/add')

            } catch (error) {
                console.log(error)
            }
        } else {
            return res.render('login', {
                errors: errors.mapped()
            })
        }
    },
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/users/login')
    },
    /* APIS */
    verifyUsername : async (req,res) => {

        const {username} = req.body;

        let user = await db.User.findOne({
            where : {
                username
            }
        })
        if(user){
            return res.status(200).json({
                ok: false,
                msg : 'El nombre de usuario ya existe'
            })
        }else{
            return res.status(200).json({
                ok : true
            })
        }
    },
    getIdsLocal : async (req,res) => {
        try {
          let idsLocal = await db.User.findAll({
            attributes : ['idLocal']
          });
          let ids = idsLocal.map(id => id.idLocal);
          console.log('====================================');
          console.log(ids);
          console.log('====================================');
          return res.json({
            ok: true,
            ids 
          });
        } catch (error) {
          console.log('====================================');
          console.log(error);
          console.log('====================================');
          return res
            .status(error.status || 500)
            .json(
              error.status === 500
                ? "Comuníquese con el administrador del sitio"
                : error.message
            );
        }
      }
}