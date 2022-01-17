const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('prices')
    },
    add : (req,res) => {
        res.render('priceAdd')
    },
    store : (req,res) => {
        res.render('prices')
    },
    detail : (req,res) => {
        res.render('priceDetail')
    },
    edit : (req,res) => {
        res.render('priceEdit')
    },
    update : (req,res) => {
        res.render('priceUpdate')
    },
    remove : (req,res) => {
        res.render('prices')
    },
    search : (req,res) => {
        res.render('prices')
    }
}