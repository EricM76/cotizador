const db = require('../database/models');

module.exports = {
    form: (req, res) => {
        const systems = db.System.findAll();
        const cloths = db.Cloth.findAll();
        const colors = db.Color.findAll();
        const supports = db.Support.findAll();
        const patterns = db.Pattern.findAll();
        const chains = db.Chain.findAll();

        Promise.all([systems, cloths, colors, supports, patterns, chains])
            .then((systems, cloths, colors, supports, patterns, chains) => {
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