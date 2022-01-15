const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('colors')
    },
    add : (req,res) => {
        res.render('colorAdd')
    },
    store : (req,res) => {
        res.render('colors')
    },
    detail : (req,res) => {
        res.render('colorDetail')
    },
    edit : (req,res) => {
        res.render('colorEdit')
    },
    update : (req,res) => {
        res.render('colorUpdate')
    },
    remove : (req,res) => {
        res.render('colors')
    }
}