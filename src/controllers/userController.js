const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('users')
    },
    add : (req,res) => {
        res.render('userAdd')
    },
    store : (req,res) => {
        res.render('users')
    },
    detail : (req,res) => {
        res.render('userDetail')
    },
    edit : (req,res) => {
        res.render('userEdit')
    },
    update : (req,res) => {
        res.render('userUpdate')
    },
    remove : (req,res) => {
        res.render('users')
    }
}