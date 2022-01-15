const db = require('../database/models');

module.exports = {
    form: (req, res) => {
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
    }
}