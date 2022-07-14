const db = require("../database/models");
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    let total = await db.Cloth.count({
      where: { visible: true },
    });
    db.Cloth.findAll({
      where: {
        visible: true,
      },
      limit: 8,
    })
      .then((items) =>
        res.render("cloths", {
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
    res.render("clothAdd");
  },
  store: (req, res) => {
    let { name, price, enabled, idLocal, width } = req.body;

    enabled = enabled ? 1 : 0;

    db.Cloth.create({
      visible: enabled,
      name,
      idLocal,
      price : +price || 0,
      width,
    }).then( () => {
      console.log('tela agregada con éxito');
      return res.redirect("/cloths");
    }).catch(error => console.log(error))

  },
  detail: (req, res) => {
    res.render("clothDetail");
  },
  edit: async (req, res) => {
    const item = await db.Cloth.findByPk(req.params.id);
    res.render("clothEdit", { item });
  },
  update: (req, res) => {
    let { name, price, enabled, idLocal, width } = req.body;

    enabled = enabled ? 1 : 0;

    db.Cloth.update(
      {
        visible: enabled,
        name,
        idLocal,
        price,
        width,
      },
      {
        where: { id: req.params.id },
      }
    );

    res.redirect("/cloths");
  },
  remove: (req, res) => {
    db.Cloth.destroy({ where: { id: req.params.id } });
    res.redirect("/cloths");
  },
  filter: async (req, res) => {
    let { order, filter, keywords, active, pages } = req.query;
    let items = [];
    let total = 0;
    try {
      if (filter === "all") {
        total = await db.Cloth.count({
          where: {
            name: {
              [Op.substring]: keywords,
            },
          },
        });
        items = await db.Cloth.findAll({
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
        total = await db.Cloth.count({
          where: {
            visible: filter || true,
            name: {
              [Op.substring]: keywords,
            },
          },
        });
        items = await db.Cloth.findAll({
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
      return res.render("cloths", {
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
  /* apis */
  visibility: async (req, res) => {
    const { id, visibility } = req.params;
    console.log(visibility);
    try {
      await db.Cloth.update(
        { visible: visibility === "true" ? 0 : 1 },
        { where: { id } }
      );
      return res.status(200).json({
        ok: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        ok: false,
        msg: error.msg,
      });
    }
  },
  getIdsLocal : async (req,res) => {
    try {
      let idsLocal = await db.Cloth.findAll({
        attributes : ['idLocal']
      });
      let ids = idsLocal.map(id => id.idLocal);
      console.log('====================================');
      console.log(ids);
      console.log('====================================');
      return res.json({
        ok: true,
        ids 
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      return res
        .status(error.status || 500)
        .json(
          error.status === 500
            ? "Comuníquese con el administrador del sitio"
            : error.message
        );
    }
  }
};
