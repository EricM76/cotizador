const db = require('../database/models');
const {Op} = require('sequelize');

module.exports = {
    index: async (req, res) => {
        let total = await db.System.count({
            where : {visible : true}
        })
        db.System.findAll({
            where: {
                visible: true,
            },
            limit : 8
        })
            .then(items => res.render('systems', {
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
        res.render('systemAdd')
    },
    store : (req,res) => {
        res.render('system')
    },
    detail : (req,res) => {
        res.render('systemDetail')
    },
    edit : (req,res) => {
        
        const system = db.System.findByPk(req.params.id,{
            include : {
                all : true
            }
        });
        const cloths = db.Cloth.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const colors = db.Color.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const supports = db.Support.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const patterns = db.Pattern.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const chains = db.Chain.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        
        Promise.all([system,cloths, colors, supports, patterns, chains])
            .then(([system,cloths, colors, supports, patterns, chains]) => {
                //return res.send(system)
                return res.render('systemEdit',{
                    system,
                    cloths,
                    colors,
                    supports,
                    patterns,
                    chains,
                    clothsIds : system.cloths.map(item => item.id),
                    colorsIds : system.colors.map(item => item.id),
                    supportsIds : system.supports.map(item => item.id),
                    patternsIds : system.patterns.map(item => item.id),
                    chainsIds : system.chains.map(item => item.id),

                })
            })
            .catch(error => console.log(error))

    },
    update : async (req,res) => {
        let  {name, price, idLocal, cloths, colors, supports, patterns, chains, visible} = req.body;
        cloths = typeof cloths === 'string' ? cloths.split() : cloths;
        colors = typeof colors === 'string' ? colors.split() : colors;
        supports = typeof supports === 'string' ? supports.split() : supports;
        patterns = typeof patterns === 'string' ? patterns.split() : patterns;
        chains = typeof chains === 'string' ? chains.split() : chains;

        cloths = cloths && cloths.map(cloth => ({
            systemId : req.params.id,
            clothId : cloth
        }));
        colors = colors && colors.map(color => ({
            systemId : req.params.id,
            colorId : color
        }));
        supports = supports && supports.map(support => ({
            systemId : req.params.id,
            supportId : support
        }));
        patterns = patterns && patterns.map(pattern => ({
            systemId : req.params.id,
            patternId : pattern
        }));
        chains = chains && chains.map(chain => ({
            systemId : req.params.id,
            chainId : chain
        }));
       
        try {
            await db.System.update(
                {
                    name : name.trim(),
                    price,
                    idLocal,
                    visible : visible ? true : false
                },
                {
                    where : {id : req.params.id}
                }
            )
            await db.SystemCloth.destroy({
                where : {systemId : req.params.id}
            });
            cloths && await db.SystemCloth.bulkCreate(cloths, { validate: true });

            await db.SystemColor.destroy({
                where : {systemId : req.params.id}
            });
            colors && await db.SystemColor.bulkCreate(colors, { validate: true });

            await db.SystemSupport.destroy({
                where : {systemId : req.params.id}
            });
            supports && await db.SystemSupport.bulkCreate(supports, { validate: true });

            await db.SystemPattern.destroy({
                where : {systemId : req.params.id}
            });
            patterns && await db.SystemPattern.bulkCreate(patterns, { validate: true });

            await db.SystemChain.destroy({
                where : {systemId : req.params.id}
            });
            chains && await db.SystemChain.bulkCreate(chains, { validate: true });
        
        } catch (error) {
            console.log(error)
        }
      
        return res.redirect('/systems')
    },
    remove : (req,res) => {
        res.render('systems')
    },
    filter: async (req, res) => {

        let { order, filter, keywords, active,pages }= req.query;
        let items = [];
        let total = 0;
        try {
            if (filter === "all") {
                total = await db.System.count({
                    where : {
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.System.findAll({
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
                total = await db.System.count({
                    where: {
                        visible: filter || true,
                        name : {
                            [Op.substring] : keywords
                        }
                    },
                })
                items = await db.System.findAll({
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
            return res.render('systems', {
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

            await db.System.update(
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