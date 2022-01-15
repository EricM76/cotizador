const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('supports')
    },
    add : (req,res) => {
        res.render('supportAdd')
    },
    store : (req,res) => {
        res.render('supports')
    },
    detail : (req,res) => {
        res.render('supportDetail')
    },
    edit : (req,res) => {
        res.render('supportEdit')
    },
    update : (req,res) => {
        res.render('supportUpdate')
    },
    remove : (req,res) => {
        res.render('supports')
    }
}