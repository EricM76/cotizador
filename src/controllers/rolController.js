const db = require('../database/models');
const {Op} = require('sequelize');

module.exports = {
    index: async (req, res) => {
        let total = await db.Rol.count()
        db.Rol.findAll({
            limit : 8
        })
            .then(items => res.render('rols', {
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
        res.render('rolAdd')
    },
    store : (req,res) => {
        let { name,coefficient } = req.body;

        db.Rol.create({
          name,
          coefficient : +coefficient/100 
        }).then( () => {
            console.log('rol agregado con éxito')
            return res.redirect("/rols");
        }).catch(error => console.log(error))
    },
    detail : (req,res) => {
        res.render('rolDetail')
    },
    edit :async (req,res) => {
        const item = await db.Rol.findByPk(req.params.id);
        res.render("rolEdit", { item });
    },
    update : (req,res) => {
        let { name, coefficient } = req.body;
    
       db.Rol.update(
          {
            name,
            coefficient : +coefficient/100 
        },
          {
            where: { id: req.params.id },
          }
        );
    
        res.redirect("/rols");
    },
    remove : (req,res) => {
        db.Rol.destroy({where:{id: req.params.id}})
        res.redirect('/rols')
    },
    filter: async (req, res) => {

        let { order, filter, keywords, active,pages }= req.query;
        let items = [];
        let total = 0;
        try {
            if (filter === "all") {
                total = await db.Rol.count({
                    where : {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.Rol.findAll({
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
                total = await db.Rol.count({
                    where: {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.Rol.findAll({
                    where: {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                    order: [order || 'id'],
                    limit : 8,
                    offset : active && (+active * 8) - 8 

                })
            }
            return res.render('rols', {
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