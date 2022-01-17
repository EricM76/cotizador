const db = require('../database/models');
const {Op} = require('sequelize');

module.exports = {
    index: async (req, res) => {
        let total = await db.Pattern.count({
            where : {visible : true}
        })
        db.Pattern.findAll({
            where: {
                visible: true,
            },
            limit : 8
        })
            .then(items => res.render('patterns', {
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
        res.render('patternAdd')
    },
    store : (req,res) => {
        res.render('patterns')
    },
    detail : (req,res) => {
        res.render('patternDetail')
    },
    edit : (req,res) => {
        res.render('patternEdit')
    },
    update : (req,res) => {
        res.render('patternUpdate')
    },
    remove : (req,res) => {
        res.render('patterns')
    },
    filter: async (req, res) => {

        let { order, filter, keywords, active,pages }= req.query;
        let items = [];
        let total = 0;
        try {
            if (filter === "all") {
                total = await db.Pattern.count({
                    where : {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.Pattern.findAll({
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
                total = await db.Pattern.count({
                    where: {
                        visible: filter || true,
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.Pattern.findAll({
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
            return res.render('patterns', {
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

        try {

            await db.Color.update(
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