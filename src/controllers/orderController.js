const db = require('../database/models');
const { Op } = require('sequelize');

module.exports = {
    index: (req, res) => {
        res.render('orders')
    },
    add: async (req, res) => {

        const quoters = JSON.parse(req.query.quoters).map(quoter => +quoter)
        try {
            let items = await db.Quotation.findAll({
                where: {
                    id: {
                        [Op.in]: quoters
                    }
                },
                include: [{ all: true }]
            })

            return res.render('orderAdd', {
                items
            })
        } catch (error) {
            console.log(error)
        }
    },
    preview: async (req, res) => {

        db.Order.findOne({
            where: {
                id: +req.query.order
            },
            include: [
                {
                    association: 'user',
                    attributes: ['name','surname']
                },
                {
                    association: 'quotations',
                    include: { all: true }
                }
            ]
        }).then(order => {
            
            const names = order.quotations.map(quotation => quotation.reference)

            const references = [...new Set(names)];

            const amounts = order.quotations.map(quotation => quotation.amount * quotation.quantity);

            const total = amounts.reduce((acum,num) => acum + num)

            return res.render('orderPreview', {
                order,
                user: order.user,
                quotations: order.quotations,
                references,
                total,
                toThousand : n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            });
        }).catch(error => console.log(error))


    },
    store: async (req, res) => {

        let { id: ids, quantity: quantities, supportOrientation: supportOrientations, clothOrientation: clothOrientations, command: commands, observations } = req.body;

        if (typeof ids === "string") {
            ids = [ids];
            quantities = [quantities]
            supportOrientations = [supportOrientations]
            clothOrientations = [clothOrientations]
            commands = [commands]
            observations = [observations]
        }

        try {

            let order = await db.Order.create({
                userId: req.session.userLogin.id,
                packaging: 200
            })

            for (let i = 0; i < ids.length; i++) {
                await db.Quotation.update(
                    {
                        quantity: quantities[i],
                        command: commands[i],
                        supportOrientation: supportOrientations[i],
                        clothOrientation: clothOrientations[i],
                        observations: observations[i]
                    },
                    {
                        where: {
                            id: +ids[i]
                        }
                    },
                )
                await db.OrderQuotation.create({
                    quotationId: +ids[i],
                    orderId: order.id
                })
            }

            return res.redirect('/orders/preview?order=' + order.id)

        } catch (error) {
            console.log(error);
        }

    },
    detail: (req, res) => {
        res.render('orderDetail')
    },
    edit: (req, res) => {
        res.render('orderEdit')
    },
    update: (req, res) => {
        res.render('orderUpdate')
    },
    remove: (req, res) => {
        res.render('orders')
    },
    search: (req, res) => {
        res.render('orders')
    },
    /* apis */


}