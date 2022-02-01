const db = require('../database/models');
const moment = require('moment');
module.exports = {
    index: async (req, res) => {
        let total = await db.Quotation.count({
            where : {
                userId : req.session.userLogin?.id || 86
            }
        })
        db.Quotation.findAll({
            where : {
                userId : req.session.userLogin?.id || 86
            },
            limit : 40,
            order : [
                ['id','DESC']
            ],
            include : {all : true}
        })
            .then(items => {
            return res.render('quotations', {
                    items,
                    total,
                    active : 1,
                    pages : 1,
                    keywords : "",
                    multiplo : total%8 === 0 ? 0 : 1,
                    moment
                })
            })
            .catch(error => console.log(error));
        
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
                if(priceSystem){
                    data = data + priceSystem.price
                }
                if(priceCloth){
                    data = data + priceCloth.price
                }
                if(priceSupport){
                    data = data + priceSupport.price
                }
                if(pricePattern){
                    data = data + pricePattern.price
                }
                if(priceChain){
                    data = data + priceChain.price
                }
            }

            console.log(price?.id,'>>>>>>>>>>>>PRECIO',price?.amount)
            console.log(grid?.id,'>>>>>>>>>>>>GRILLA',grid?.price)
            console.log(priceSystem?.id,'>>>>>>>>>>>>SISTEMA',priceSystem?.price)
            console.log(priceCloth?.id,'>>>>>>>>>>>>TELA',priceCloth?.price)
            console.log(priceSupport?.id,'>>>>>>>>>>>>SOPORTE',priceSupport?.price)
            console.log(pricePattern?.id,'>>>>>>>>>>>>MODELO',pricePattern?.price)
            console.log(priceChain?.id,'>>>>>>>>>>>>CADENA',priceChain?.price)

            /* GUARDAR la cotización, si esta existe */
            if(data){
                /* 
                const { system, cloth, color, support, pattern, chain, width,heigth,reference} = req.body;
                */
                const quotation = await db.Quotation.create({
                    clothWidth : +width,
                    heigth : +heigth,
                    amount : data,
                    date : new Date(),
                    reference,
                    systemId : +system,
                    clothId : +cloth,
                    colorId : +color,
                    supportId : +support,
                    patternId : +pattern,
                    chainId : +chain,
                    userId : req.session.userLogin?.id || 85
                })
                if(quotation){
                    console.log('cotización guardada exitosamente!');
                }
            }
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

        console.log('guardando...');
        //res.render('quoters')
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