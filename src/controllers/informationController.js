const db = require("../database/models");
const { Op } = require("sequelize");
module.exports = {
  backout: (req, res) => {
    res.render("messagePremiumStandard");
  },
  width: async (req, res) => {
    const items = await db.Cloth.findAll({ where: { visible: true },order:[['name','ASC']] });
    res.render("clothWidth", { items, total: items.length });
  },
  search: async (req, res) => {
    const items = await db.Cloth.findAll({
      where: {
        visible: true,
        name: {
            [Op.like]: `%${req.query.search}%`,
          }
      },
      order:[['name','ASC']]
    });
    res.render("clothWidth", {
      items,
      keywords: req.query.search,
      total: items.length,
    });
  },
};
