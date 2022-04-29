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
        let { name, enabled,price, idLocal } = req.body;

        enabled = enabled ? 1 : 0;

        db.Pattern.create({
          visible: enabled,
          name,
          idLocal,
          price : +price || 0
        }).then( () => {
            console.log('modelo agregado con éxito')
            return res.redirect("/patterns");
        }).catch(error => console.log(error))

    },
    detail : (req,res) => {
        res.render('patternDetail')
    },
    edit :async (req,res) => {
        const item = await db.Pattern.findByPk(req.params.id);
        res.render("patternEdit", { item });
    },
    update : (req,res) => {
        let { name, enabled,price, idLocal } = req.body;

        enabled = enabled ? 1 : 0;
    
       db.Pattern.update(
          {
            visible: enabled,
            name,
            idLocal,
            price
          },
          {
            where: { id: req.params.id },
          }
        );
    
        res.redirect("/patterns");
    },
    remove : (req,res) => {
        db.Pattern.destroy({where:{id: req.params.id}})
        res.redirect('/patterns')
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
    /* apis */
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
    },
    getIdsLocal : async (req,res) => {
        try {
          let idsLocal = await db.Pattern.findAll({
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