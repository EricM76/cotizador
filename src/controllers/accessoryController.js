const db = require("../database/models");
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    let total = await db.System.count({
      where: {
        visible: true,
        accessory: true,
      },
    });
    db.System.findAll({
      where: {
        visible: true,
        accessory: true,
      },
      limit: 8,
    })
      .then((items) =>
        res.render("accessories", {
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
    const cloths = db.Cloth.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });
    const colors = db.Color.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });
    const supports = db.Support.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });
    const patterns = db.Pattern.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });
    const chains = db.Chain.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });

    Promise.all([cloths, colors, supports, patterns, chains])
      .then(([cloths, colors, supports, patterns, chains]) => {
        return res.render("accessoryAdd", {
          cloths,
          colors,
          supports,
          patterns,
          chains,
        });
      })
      .catch((error) => console.log(error));
  },
  store: async (req, res) => {
    let {
      name,
      price,
      idLocal,
      cloths,
      colors,
      supports,
      patterns,
      chains,
      visible,
    } = req.body;

    cloths = typeof cloths === "string" ? cloths.split() : cloths;
    colors = typeof colors === "string" ? colors.split() : colors;
    supports = typeof supports === "string" ? supports.split() : supports;
    patterns = typeof patterns === "string" ? patterns.split() : patterns;
    chains = typeof chains === "string" ? chains.split() : chains;

    try {
      const system = await db.System.create(
        {
          name: name.trim(),
          price,
          idLocal,
          visible: visible ? true : false,
        },
        {
          where: { id: req.params.id },
        }
      );

      cloths =
        cloths &&
        cloths.map((cloth) => ({
          systemId: system.id,
          clothId: cloth,
        }));

      colors =
        colors &&
        colors.map((color) => ({
          systemId: system.id,
          colorId: color,
        }));

      supports =
        supports &&
        supports.map((support) => ({
          systemId: system.id,
          supportId: support,
        }));

      patterns =
        patterns &&
        patterns.map((pattern) => ({
          systemId: system.id,
          patternId: pattern,
        }));

      chains =
        chains &&
        chains.map((chain) => ({
          systemId: system.id,
          chainId: chain,
        }));

      cloths && (await db.SystemCloth.bulkCreate(cloths, { validate: true }));
      colors && (await db.SystemColor.bulkCreate(colors, { validate: true }));
      supports &&
        (await db.SystemSupport.bulkCreate(supports, { validate: true }));
      patterns &&
        (await db.SystemPattern.bulkCreate(patterns, { validate: true }));
      chains && (await db.SystemChain.bulkCreate(chains, { validate: true }));
    } catch (error) {
      console.log(error);
    }

    res.redirect("/accessories");
  },
  detail: (req, res) => {
    res.render("accessoryDetail");
  },
  edit: (req, res) => {
    const system = db.System.findByPk(req.params.id, {
      include: {
        all: true,
      },
    });
    const cloths = db.Cloth.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });
    const colors = db.Color.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });
    const supports = db.Support.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });
    const patterns = db.Pattern.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });
    const chains = db.Chain.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    });

    Promise.all([system, cloths, colors, supports, patterns, chains])
      .then(([system, cloths, colors, supports, patterns, chains]) => {
        return res.render("accessoryEdit", {
          system,
          cloths,
          colors,
          supports,
          patterns,
          chains,
          clothsIds: system.cloths.map((item) => item.id),
          colorsIds: system.colors.map((item) => item.id),
          supportsIds: system.supports.map((item) => item.id),
          patternsIds: system.patterns.map((item) => item.id),
          chainsIds: system.chains.map((item) => item.id),
        });
      })
      .catch((error) => console.log(error));
  },
  update: async (req, res) => {
    let {
      name,
      price,
      idLocal,
      visible,
      accessory,
    } = req.body;

    try {
      await db.System.update(
        {
          name: name.trim(),
          price,
          idLocal,
          visible: visible ? true : false,
          accessory: accessory ? true : false,
        },
        {
          where: { id: req.params.id },
        }
      );

    } catch (error) {
      console.log(error);
    }

    return res.redirect("/accessories");
  },
  remove: async (req, res) => {
    try {
      await db.System.destroy({ where: { id: req.params.id } });
      res.redirect("/accessories");
    } catch (error) {
      console.log(error);
    }
  },
  filter: async (req, res) => {
    let { order, filter, keywords, active, pages } = req.query;
    let items = [];
    let total = 0;
    try {
      if (filter === "all") {
        total = await db.System.count({
          where: {
            name: {
              [Op.substring]: keywords,
            },
          },
        });
        items = await db.System.findAll({
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
        total = await db.System.count({
          where: {
            visible: filter || true,
            accessory: true,
            name: {
              [Op.substring]: keywords,
            },
          },
        });
        items = await db.System.findAll({
          where: {
            visible: filter || true,
            accessory: true,
            name: {
              [Op.substring]: keywords,
            },
          },
          order: [order || "id"],
          limit: 8,
          offset: active && +active * 8 - 8,
        });
      }
      return res.render("accessories", {
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
  /* APIS */
  visibility: async (req, res) => {
    const { id, visibility } = req.params;
    console.log(visibility);
    try {
      await db.System.update(
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
  getAll: async (req, res) => {
    try {
      const systems = await db.System.findAll({
        where: {
          visible: true,
          accessory: false,
        },
        order: ["name"],
      });

      return res.status(200).json({
        ok: true,
        data: systems,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.status || 500)
        .json(
          error.status === 500
            ? "Comuníquese con el administrador del sitio"
            : error.message
        );
    }
  },
};
