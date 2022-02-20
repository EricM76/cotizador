const db = require("../database/models");
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
   res.render('catalogue')
  },

};

