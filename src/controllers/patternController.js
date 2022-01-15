const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('patterns')
    },
    add : (req,res) => {
        res.render('patternAdd')
    },
    store : (req,res) => {
        res.render('patterns')
    },
    detail : (req,res) => {
        res.render('patternDetail')
    },
    edit : (req,res) => {
        res.render('patternEdit')
    },
    update : (req,res) => {
        res.render('patternUpdate')
    },
    remove : (req,res) => {
        res.render('patterns')
    }
}