const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('orders')
    },
    add : (req,res) => {
        res.render('orderAdd')
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
    }
}