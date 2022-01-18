const db = require('../database/models');

module.exports = {
    index: (req, res) => {
        res.render('quoters')
    },
    add: (req, res) => {
        db.System.findAll({
            where: {
                visible: true
            },
            order: ['name']
        })
            .then((systems) => {
                return res.render('quoter', {
                    systems,
                })
            })
            .catch(error => console.log(error))
    },
    load: async (req, res) => {

        try {
            const system = await db.System.findByPk(req.params.id, {
                include: [{ all: true }]
            });

            return res.status(200).json({
                ok: true,
                data: system
            })

        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json(error.status === 500 ? "Comuníquese con el administrador del sitio" : error.message);
        }
    },
    quote: async (req, res) => {
        
        try {
            const { system, cloth, color, support, pattern, chain, width,heigth,reference} = req.body;
            
            const price = await db.Price.findOne({
                where: {
                    systemId: +system,
                    clothId: +cloth,
                    colorId: +color,
                    visible: true
                }
            })

            const grid = await db.Grid.findOne({
                where : {
                    width : +width,
                    heigth : +heigth,
                    visible : true
                }
            })

            const priceSystem = await db.System.findOne({
                where : {
                    id : +system
                }
            })

            const priceCloth = await db.Cloth.findOne({
                where : {
                    id : +cloth
                }
            })

            const priceSupport = await db.Support.findOne({
                where : {
                    id : +support
                }
            })

            const pricePattern = await db.Pattern.findOne({
                where : {
                    id : +pattern
                }
            })

            const priceChain = await db.Chain.findOne({
                where : {
                    id : +chain
                }
            })

            let data = null;

            if(price && grid){
                data = price.amount + grid.price;
            }

           /*  console.log(price?.id,'>>>>>>>>>>>>PRECIO',price?.amount)
            console.log(grid?.id,'>>>>>>>>>>>>GRILLA',grid?.price)
            console.log(priceSystem?.id,'>>>>>>>>>>>>SISTEMA',priceSystem?.price)
            console.log(priceCloth?.id,'>>>>>>>>>>>>TELA',priceCloth?.price)
            console.log(priceSupport?.id,'>>>>>>>>>>>>SOPORTE',priceSupport?.price)
            console.log(pricePattern?.id,'>>>>>>>>>>>>MODELO',pricePattern?.price)
            console.log(priceChain?.id,'>>>>>>>>>>>>CADENA',priceChain?.price) */


            return res.status(200).json({
                ok: true,
                data
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json(error.status === 500 ? "Comuníquese con el administrador del sitio" : error.message);
        }

    },
    store: (req, res) => {
        res.render('quoters')
    },
    detail: (req, res) => {
        res.render('quoterDetail')
    },
    edit: (req, res) => {
        res.render('quoterEdit')
    },
    update: (req, res) => {
        res.render('quoterUpdate')
    },
    remove: (req, res) => {
        res.render('quoters')
    },
    search: (req, res) => {
        res.render('quoters')
    }
}