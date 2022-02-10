const db = require('../database/models');
const { Op } = require('sequelize');

module.exports = {
    index : (req,res) => {
        res.render('orders')
    },
    add : async (req,res) => {
        console.log('>>>>>>>>>>>>>', req.query.quoters);

        const quoters = req.query.quoters.map(quoter => +quoter)

        db.Quotation.findAll({
            where : {
                id : {
                    [Op.in] : quoters
                }
            }
        })
            .then(items => {
                return res.send(items)
                res.render('orderAdd')
            })
            .catch(error => console.log(error))
       
    },
    store : (req,res) => {
        res.render('orders')
    },
    detail : (req,res) => {
        res.render('orderDetail')
    },
    edit : (req,res) => {
        res.render('orderEdit')
    },
    update : (req,res) => {
        res.render('orderUpdate')
    },
    remove : (req,res) => {
        res.render('orders')
    },
    search : (req,res) => {
        res.render('orders')
    }
    
}