const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('cloths')
    },
    add : (req,res) => {
        res.render('clothAdd')
    },
    store : (req,res) => {
        res.render('cloths')
    },
    detail : (req,res) => {
        res.render('clothDetail')
    },
    edit : (req,res) => {
        res.render('clothEdit')
    },
    update : (req,res) => {
        res.render('clothUpdate')
    },
    remove : (req,res) => {
        res.render('cloths')
    }
}