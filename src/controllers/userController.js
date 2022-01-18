const db = require('../database/models');
const {Op} = require('sequelize');

module.exports = {
    index: async (req, res) => {
        let total = await db.User.count({
            where : {enabled : true}
        })
        db.User.findAll({
            where: {
                enabled: true,
            },
            limit : 8
        })
            .then(items => res.render('users', {
                items,
                total,
                active : 1,
                pages : 1,
                keywords : "",
                multiplo : total%8 === 0 ? 0 : 1
            }))
            .catch(error => console.log(error))
    },
    register : (req,res) => {
        res.render('register')
    },
    processRegister : (req,res) => {
        res.render('users')
    },
    login : (req,res) => {
        res.render('login')
    },
    processLogin : (req,res) => {
        res.render('userAdd')
    },
    credentials : (req,res) => {
        res.render('userCredential')
    },
    profile : (req,res) => {
        res.render('userProfile')
    },
    update : (req,res) => {
        res.render('userUpdate')
    },
    remove : (req,res) => {
        res.render('users')
    },
    search : (req,res) => {
        res.render('users')
    },
    filter: async (req, res) => {

        let { order, filter, keywords, active,pages }= req.query;
        let items = [];
        let total = 0;
        try {
            if (filter === "all") {
                total = await db.User.count({
                    where : {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.User.findAll({
                    where : {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                    order: [order || 'id'],
                    limit : 8,
                    offset : active && (+active * 8) - 8 
                })
            } else {
                total = await db.User.count({
                    where: {
                        enabled: filter || true,
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.User.findAll({
                    where: {
                        enabled: filter || true,
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                    order: [order || 'id'],
                    limit : 8,
                    offset : active && (+active * 8) - 8 

                })
            }
            return res.render('users', {
                items,
                total,
                active,
                pages,
                keywords,
                multiplo : total%8 === 0 ? 0 : 1
            })
        } catch (error) {
            console.log(error)
        }
    },
    enable : async (req,res) => {

        const { id, enable } = req.body;

        try {

            await db.User.update(
                { enabled: enable === true ? 0 : 1 },
                { where: { id } }
            )

            return res.status(200).json({
                ok: true,
                msg : 'Habilitación modificada con éxito!'
            })

        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.status === 500 ? "Comuníquese con el administrador del sitio" : error.message
            })
        }
    }
}