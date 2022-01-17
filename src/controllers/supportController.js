const db = require('../database/models');
const {Op} = require('sequelize');

module.exports = {
    index: async (req, res) => {
        let total = await db.Support.count({
            where : {visible : true}
        })
        db.Support.findAll({
            where: {
                visible: true,
            },
            limit : 8
        })
            .then(items => res.render('supports', {
                items,
                total,
                active : 1,
                pages : 1,
                keywords : "",
                multiplo : total%8 === 0 ? 0 : 1
            }))
            .catch(error => console.log(error))
    },
    add : (req,res) => {
        res.render('supportAdd')
    },
    store : (req,res) => {
        res.render('supports')
    },
    detail : (req,res) => {
        res.render('supportDetail')
    },
    edit : (req,res) => {
        res.render('supportEdit')
    },
    update : (req,res) => {
        res.render('supportUpdate')
    },
    remove : (req,res) => {
        res.render('supports')
    },
    filter: async (req, res) => {

        let { order, filter, keywords, active,pages }= req.query;
        let items = [];
        let total = 0;
        try {
            if (filter === "all") {
                total = await db.Support.count({
                    where : {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.Support.findAll({
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
                total = await db.Support.count({
                    where: {
                        visible: filter || true,
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.Support.findAll({
                    where: {
                        visible: filter || true,
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                    order: [order || 'id'],
                    limit : 8,
                    offset : active && (+active * 8) - 8 

                })
            }
            return res.render('supports', {
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
    visibility: async (req, res) => {

        const { id, visibility } = req.params;
        console.log(visibility)
        try {

            await db.Support.update(
                { visible: visibility === "true" ? 0 : 1 },
                { where: { id } }
            )

        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.msg
            })
        }
    }
}