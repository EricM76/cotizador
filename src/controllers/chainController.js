const db = require("../database/models");
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    let total = await db.Chain.count({
      where: { visible: true },
    });
    db.Chain.findAll({
      where: {
        visible: true,
      },
      limit: 8,
    })
      .then((items) =>
        res.render("chains", {
          items,
          total,
          active: 1,
          pages: 1,
          keywords: "",
          multiplo: total % 8 === 0 ? 0 : 1,
        })
      )
      .catch((error) => console.log(error));
  },
  add: (req, res) => {
    res.render("chainAdd");
  },
  store: (req, res) => {
    let { name, price, enabled, idLocal } = req.body;
    
    enabled = enabled ? 1 : 0;

    db.Chain.create({
      visible: enabled,
      name,
      idLocal,
      price
    });

    res.redirect("/chains");
  },
  detail: (req, res) => {
    res.render("chainDetail");
  },
  edit: (req, res) => {
    res.render("chainEdit");
  },
  update: (req, res) => {
    res.render("chainUpdate");
  },
  remove: (req, res) => {
    res.render("chains");
  },
  filter: async (req, res) => {
    let { order, filter, keywords, active, pages } = req.query;
    let items = [];
    let total = 0;
    try {
      if (filter === "all") {
        total = await db.Chain.count({
          where: {
            name: {
              [Op.substring]: keywords,
            },
          },
        });
        items = await db.Chain.findAll({
          where: {
            name: {
              [Op.substring]: keywords,
            },
          },
          order: [order || "id"],
          limit: 8,
          offset: active && +active * 8 - 8,
        });
      } else {
        total = await db.Chain.count({
          where: {
            visible: filter || true,
            name: {
              [Op.substring]: keywords,
            },
          },
        });
        items = await db.Chain.findAll({
          where: {
            visible: filter || true,
            name: {
              [Op.substring]: keywords,
            },
          },
          order: [order || "id"],
          limit: 8,
          offset: active && +active * 8 - 8,
        });
      }
      console.log(items);
      return res.render("chains", {
        items,
        total,
        active,
        pages,
        keywords,
        multiplo: total % 8 === 0 ? 0 : 1,
      });
    } catch (error) {
      console.log(error);
    }
  },
  visibility: async (req, res) => {
    const { id, visibility } = req.params;

    try {
      await db.Chain.update(
        { visible: visibility === "true" ? 0 : 1 },
        { where: { id } }
      );
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        ok: false,
        msg: error.msg,
      });
    }
  },
};
