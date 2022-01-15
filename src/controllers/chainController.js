const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('chains')
    },
    add : (req,res) => {
        res.render('chainAdd')
    },
    store : (req,res) => {
        res.render('chains')
    },
    detail : (req,res) => {
        res.render('chainDetail')
    },
    edit : (req,res) => {
        res.render('chainEdit')
    },
    update : (req,res) => {
        res.render('chainUpdate')
    },
    remove : (req,res) => {
        res.render('chains')
    }
}