const db = require('../database/models');
const moment = require('moment');
const { Op } = require('sequelize');

module.exports = {
    index: async (req, res) => {
        if (req.session.userLogin?.rol === 1) {
            let total = await db.Quotation.count();
            let users = await db.Quotation.findAll({
                attributes: ['userId'],
                include: [
                    { association: 'user' }
                ],
                group: ['userId'],
                having: ''

            })

            db.Quotation.findAll({
                limit: 8,
                include: { all: true }
            })
                .then(items => {
                    return res.render('quotations', {
                        items,
                        total,
                        active: 1,
                        pages: 1,
                        keywords: "",
                        multiplo: total % 8 === 0 ? 0 : 1,
                        moment,
                        users
                    })
                })
                .catch(error => console.log(error));
        } else {
            let total = await db.Quotation.count({
                where: {
                    userId: req.session.userLogin?.id || 86
                }
            })
            db.Quotation.findAll({
                where: {
                    userId: req.session.userLogin?.id || 86
                },
                limit: 8,
                include: { all: true }
            })
                .then(items => {
                    return res.render('quotations', {
                        items,
                        total,
                        active: 1,
                        pages: 1,
                        keywords: "",
                        multiplo: total % 8 === 0 ? 0 : 1,
                        moment
                    })
                })
                .catch(error => console.log(error));
        }


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
    search: async (req, res) => {
        const { keywords, filter } = req.query;
        let items = [];
        let total = 0;
        try {
            let users = await db.Quotation.findAll({
                attributes: ['userId'],
                include: [
                    { association: 'user' }
                ],
                group: ['userId'],
                having: ''

            })
            if (!filter || filter === 'all') {
                total = await db.Quotation.count({
                    where: {
                        reference: {
                            [Op.substring]: keywords
                        }
                    }
                })
                items = await db.Quotation.findAll({
                    where: {
                        reference: {
                            [Op.substring]: keywords
                        }
                    },
                    limit: 8,
                    include: { all: true }
                })
            }else{
                total = await db.Quotation.count({
                    where: {
                        reference: {
                            [Op.substring]: keywords
                        },
                        userId : filter
                    }
                })
                items = await db.Quotation.findAll({
                    where: {
                        reference: {
                            [Op.substring]: keywords
                        },
                        userId : filter
                    },
                    limit: 8,
                    include: { all: true }
                })
            }
            return res.render('quotations', {
                items,
                total,
                active: 1,
                pages: 1,
                keywords: "",
                multiplo: total % 8 === 0 ? 0 : 1,
                moment,
                users
            })
        } catch (error) {
            console.log(error);
        }
      

    },
    filter: async (req, res) => {

        let { order, filter, keywords, active, pages } = req.query;
        let items = [];
        let users = [];
        let total = 0;

        if (req.session.userLogin.rol === 1) {
            try {
                users = await db.Quotation.findAll({
                    attributes: ['userId'],
                    include: [
                        { association: 'user' }
                    ],
                    group: ['userId'],
                    having: ''

                })
                if (filter === "all") {
                    total = await db.Quotation.count()
                    items = await db.Quotation.findAll({
                        order: [order || 'id'],
                        limit: 8,
                        offset: active && (+active * 8) - 8,
                        include: { all: true }
                    })
                } else if (!filter) {
                    console.log('>>>>>>>>>> sin filtro');
                    total = await db.Quotation.count()
                    items = await db.Quotation.findAll({
                        order: [order || 'id'],
                        limit: 8,
                        offset: active && (+active * 8) - 8,
                        include: { all: true }
                    })

                } else {
                    total = await db.Quotation.count({
                        where: {
                            userId: +filter,
                        },
                    })
                    items = await db.Quotation.findAll({
                        where: {
                            userId: +filter,
                        },
                        order: [order || 'id'],
                        limit: 8,
                        offset: active && (+active * 8) - 8,
                        include: { all: true }

                    })
                }
                return res.render('quotations', {
                    items,
                    total,
                    active,
                    pages,
                    keywords: "",
                    multiplo: total % 8 === 0 ? 0 : 1,
                    moment,
                    users
                })
            } catch (error) {
                console.log(error)
            }
        } else {

        }
    },
    //APIS
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
            const { system, cloth, color, support, pattern, chain, width, heigth, reference } = req.body;

            const price = await db.Price.findOne({
                where: {
                    systemId: +system,
                    clothId: +cloth,
                    colorId: +color,
                    visible: true
                }
            })

            const grid = await db.Grid.findOne({
                where: {
                    width: +width,
                    heigth: +heigth,
                    visible: true
                }
            })

            const priceSystem = await db.System.findOne({
                where: {
                    id: +system
                }
            })
            const priceCloth = await db.Cloth.findOne({
                where: {
                    id: +cloth
                }
            })

            const priceSupport = await db.Support.findOne({
                where: {
                    id: +support
                }
            })

            const pricePattern = await db.Pattern.findOne({
                where: {
                    id: +pattern
                }
            })

            const priceChain = await db.Chain.findOne({
                where: {
                    id: +chain
                }
            })

            let data = null;

            if (price && grid) {
                data = price.amount + grid.price;
                if (priceSystem) {
                    data = data + priceSystem.price
                }
                if (priceCloth) {
                    data = data + priceCloth.price
                }
                if (priceSupport) {
                    data = data + priceSupport.price
                }
                if (pricePattern) {
                    data = data + pricePattern.price
                }
                if (priceChain) {
                    data = data + priceChain.price
                }
            }

            console.log(price?.id, '>>>>>>>>>>>>PRECIO', price?.amount)
            console.log(grid?.id, '>>>>>>>>>>>>GRILLA', grid?.price)
            console.log(priceSystem?.id, '>>>>>>>>>>>>SISTEMA', priceSystem?.price)
            console.log(priceCloth?.id, '>>>>>>>>>>>>TELA', priceCloth?.price)
            console.log(priceSupport?.id, '>>>>>>>>>>>>SOPORTE', priceSupport?.price)
            console.log(pricePattern?.id, '>>>>>>>>>>>>MODELO', pricePattern?.price)
            console.log(priceChain?.id, '>>>>>>>>>>>>CADENA', priceChain?.price)

            /* GUARDAR la cotización, si esta existe */
            if (data) {
                /* 
                const { system, cloth, color, support, pattern, chain, width,heigth,reference} = req.body;
                */
                const quotation = await db.Quotation.create({
                    clothWidth: +width,
                    heigth: +heigth,
                    amount: data,
                    date: new Date(),
                    reference,
                    systemId: +system,
                    clothId: +cloth,
                    colorId: +color,
                    supportId: +support,
                    patternId: +pattern,
                    chainId: +chain,
                    userId: req.session.userLogin?.id || 85
                })
                if (quotation) {
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
    getUsers: async (req, res) => {
        try {
            let users = await db.Quotation.findAll({
                attributes: ['userId'],
                include: [
                    {
                        association: 'user',
                        attributes: ['name']
                    }
                ],
                group: ['userId'],
                having: ''

            })

            return res.status(200).json({
                ok: true,
                data: users
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json(error.status === 500 ? "Comuníquese con el administrador del sitio" : error.message);
        }

    }
}