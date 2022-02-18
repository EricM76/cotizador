const db = require('../database/models');
const {Op} = require('sequelize');

module.exports = {
    index: async (req, res) => {
        let total = await db.Color.count({
            where : {visible : true}
        })
        db.Color.findAll({
            where: {
                visible: true,
            },
            limit : 8
        })
            .then(items => res.render('colors', {
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
        res.render('colorAdd')
    },
    store : (req,res) => {
        let { name, enabled, idLocal } = req.body;

        enabled = enabled ? 1 : 0;

        db.Color.create({
          visible: enabled,
          name,
          idLocal
        });

        res.redirect("/colors");
    },
    detail : (req,res) => {
        res.render('colorDetail')
    },
    edit : async (req,res) => {
        const item = await db.Color.findByPk(req.params.id);
        res.render("colorEdit", { item });
    },
    update : (req,res) => {
        let { name, enabled, idLocal } = req.body;

        enabled = enabled ? 1 : 0;
    
       db.Color.update(
          {
            visible: enabled,
            name,
            idLocal
          },
          {
            where: { id: req.params.id },
          }
        );
    
        res.redirect("/colors");
    },
    remove : (req,res) => {
        db.Color.destroy({where:{id: req.params.id}})
        res.redirect('/colors')
    },
    filter: async (req, res) => {

        let { order, filter, keywords, active,pages }= req.query;
        let items = [];
        let total = 0;
        try {
            if (filter === "all") {
                total = await db.Color.count({
                    where : {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.Color.findAll({
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
                total = await db.Color.count({
                    where: {
                        visible: filter || true,
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.Color.findAll({
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
            return res.render('colors', {
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