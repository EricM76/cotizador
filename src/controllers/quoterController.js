const db = require('../database/models');

module.exports = {
    index : (req,res) => {
        res.render('quoters')
    },
    add: (req, res) => {
        const systems = db.System.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const cloths = db.Cloth.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const colors = db.Color.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const supports = db.Support.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const patterns = db.Pattern.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });
        const chains = db.Chain.findAll({
            where : {
                visible : true
            },
            order : ['name']
        });

        Promise.all([systems, cloths, colors, supports, patterns, chains])
            .then(([systems, cloths, colors, supports, patterns, chains]) => {
                return res.render('quoter', {
                    systems,
                    cloths,
                    colors,
                    supports,
                    patterns,
                    chains
                })
            })
            .catch(error => console.log(error))
    },
    store : (req,res) => {
        res.render('quoters')
    },
    detail : (req,res) => {
        res.render('quoterDetail')
    },
    edit : (req,res) => {
        res.render('quoterEdit')
    },
    update : (req,res) => {
        res.render('quoterUpdate')
    },
    remove : (req,res) => {
        res.render('quoters')
    }
}