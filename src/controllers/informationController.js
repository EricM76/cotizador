const db = require('../database/models');
const {Op} = require('sequelize');
const { render } = require('../app');

module.exports = {
    backout: (req, res) => {
        res.render('messagePremiumStandard')
    },
}