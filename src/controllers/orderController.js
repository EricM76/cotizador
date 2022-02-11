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
    store: (req, res) => {
        res.render('orders')
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