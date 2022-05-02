const db = require("../database/models");
const { Op } = require('sequelize');

module.exports = {
  index: async (req, res) => {
    let systems = await db.System.findAll({
      where: {
        visible: true,
        accessory: false,
      },
      order: ['name']
    });
    let total = await db.Price.count({
      where: { visible: true }
    })
    db.Price.findAll({
      include: { all: true }
    })
      .then(items => res.render('prices', {
        systems,
        items,
        total,
        active: 1,
        pages: 1,
        keywords: "",
        multiplo: total % 8 === 0 ? 0 : 1
      }))
      .catch(error => console.log(error))
  },
  editAll: (req, res) => {
    return res.render("priceAll");
  },
  editItem: (req, res) => {
    db.Price.findOne({
      where :{
        id : req.params.id
      },
      include : {all : true}
    })
      .then(item => {
        return res.render("priceEditItem",{
          item
        });
      })
      .catch(error => console.log(error))
  },
  add: (req, res) => {
    res.render("priceAdd");
  },
  edit : (req,res) => {
    return res.render("priceItem");
  },
  store: (req, res) => {
    const { systemId, clothId, colorId, amount, idLocal, visible } = req.body;

    db.Price.findOne({
      where: {
        systemId,
        clothId,
        colorId,
      },
    }).then(async (price) => {
      if (price) {
        try {
          await db.Price.update(
            {
              amount,
              idLocal,
              visible: visible ? true : false,
            },
            {
              where: {
                id: price.id,
              },
            }
          );
          return res.redirect("/prices/edit/item?update=true");
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await db.Price.create({
            systemId,
            clothId,
            colorId,
            amount,
            idLocal,
            visible: visible ? true : false,
          });
          //return res.redirect("/prices?create=true");
          return res.redirect("/prices/edit/item?update=true");

        } catch (error) {
          console.log(error);
        }
      }
    });
  },
  detail: (req, res) => {
    res.render("priceDetail");
  },

  update: async (req, res) => {
    let { coefficient } = req.body;
    coefficient = +coefficient / 100;

    try {
      /* lista de precios */
      let data = await db.Price.findAll();
      let prices = data.map((price) => {
        return {
          id: price.id,
          amount: price.amount + price.amount * coefficient,
        };
      });

      await db.Price.bulkCreate(prices, {
        updateOnDuplicate: ["amount"],
      });

      /* precio de telas */
      data = await db.Cloth.findAll();
      prices = data.map((item) => {
        return {
          id: item.id,
          price: item.price + item.price * coefficient,
        };
      });

      await db.Cloth.bulkCreate(prices, {
        updateOnDuplicate: ["price"],
      });

      /* precio de cadenas */
      data = await db.Chain.findAll();
      prices = data.map((item) => {
        return {
          id: item.id,
          price: item.price + item.price * coefficient,
        };
      });

      await db.Chain.bulkCreate(prices, {
        updateOnDuplicate: ["price"],
      });

      /* precio de modelos */
      data = await db.Pattern.findAll();
      prices = data.map((item) => {
        return {
          id: item.id,
          price: item.price + item.price * coefficient,
        };
      });

      await db.Pattern.bulkCreate(prices, {
        updateOnDuplicate: ["price"],
      });

      /* precio de soportes */
      data = await db.Support.findAll();
      prices = data.map((item) => {
        return {
          id: item.id,
          price: item.price + item.price * coefficient,
        };
      });

      await db.Support.bulkCreate(prices, {
        updateOnDuplicate: ["price"],
      });

      /* precio de sistemas */
      data = await db.System.findAll();
      prices = data.map((item) => {
        return {
          id: item.id,
          price: item.price + item.price * coefficient,
        };
      });

    } catch (error) {
      console.log(error);
    }

    return res.redirect("/prices/edit/all?updateAll=true");
  },
  updateItem : (req,res) => {
    const {amount, idLocal} = req.body;
  db.Price.update(
        {
          amount,
          idLocal,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      ).then( () => {
        return res.redirect("/prices");
      }).catch(error => console.log(error))
  },
  search: (req, res) => {
    res.render("prices");
  },
  /* APIS */
  getDataBySystem: async (req, res) => {
    try {
      const system = await db.System.findByPk(req.params.system, {
        include: [
          { association: "cloths", attributes: ["id", "name"] },
          { association: "colors", attributes: ["id", "name"] },
        ],
      });

      return res.status(200).json({
        ok: true,
        data: system,
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
  getPrice: async (req, res) => {
    const { systemId, colorId, clothId } = req.body;

    try {
      let price = await db.Price.findOne({
        where: {
          systemId,
          colorId,
          clothId,
        },
      });

      console.log('====================================');
      console.log('SISTEMA', systemId);
      console.log('COLOR', colorId);
      console.log('TELA', clothId);
      console.log('PRECIO', price);
      console.log('====================================');

      if (price) {
        return res.json({
          ok: true,
          data: {
            amount: price.amount,
            idLocal: price.idLocal,
            visible: price.visible,
          },
        });
      } else {
        return res.json({
          ok: false,
          data: 0,
        });
      }
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
  remove: async (req, res) => {
    const { systemId, clothId, colorId } = req.body;
    console.log("====================================");
    console.log(req.body);
    console.log("====================================");
    try {
      await db.Price.destroy({
        where: {
          systemId,
          clothId,
          colorId,
        },
      });
      return res.json({
        ok: true,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(
          error.status === 500
            ? "Comuníquese con el administrador del sitio"
            : error.message
        );
    }
  },
  removeItem: async (req, res) => {
    const { id } = req.body;

    try {
      await db.Price.destroy({
        where: {
          id
        },
      });
      return res.json({
        ok: true,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(
          error.status === 500
            ? "Comuníquese con el administrador del sitio"
            : error.message
        );
    }
  },
  filter: async (req, res) => {

    let { system, cloth, color } = req.params;
    let items = [];
    let total = 0;
    try {
      if (system !== "undefined" && cloth !== "undefined" && color !== "undefined") {
        total = await db.Price.count({
          where: {
            systemId: system,
            clothId: cloth,
            colorId: color
          },
        })
        items = await db.Price.findAll({
          where: {
            systemId: system,
            clothId: cloth,
            colorId: color
          },
          include: { all: true },
          order: ['id'],

        })
      } else if (system !== "undefined" && cloth !== "undefined") {
        total = await db.Price.count({
          where: {
            systemId: system,
            clothId: cloth,
          },
        })
        items = await db.Price.findAll({
          where: {
            systemId: system,
            clothId: cloth,
          },
          include: { all: true },
          order: ['id'],

        })
      } else if(system !== "undefined") {
        total = await db.Price.count({
          where: {
            systemId: system,
          },
        })
        items = await db.Price.findAll({
          where: {
            systemId: system,
          },
          include: { all: true },
          order: ['id'],

        })
      }else {
        total = await db.Price.count()
        items = await db.Price.findAll({
          include: { all: true },
          order: ['id'],

        })
      }

      return total !== 0 
      ? res.json({
        ok: true,
        data: {
          total,
          items
        }
      }) 
      : res.json({
        ok: false,
        data : {
          total
        }
      })

    } catch (error) {
      console.log(error)
      return res
        .status(error.status || 500)
        .json(
          error.status === 500
            ? "Comuníquese con el administrador del sitio"
            : error.message
        );
    }
  },
  /* apis */
  visibility: async (req, res) => {

    const { id } = req.params;
    try {

      let price = await db.Price.findOne({
        where : {
          id
        }
      })
      await db.Price.update(
        { visible: +!price.visible },
        { where: { id } }
      )

    } catch (error) {
      console.log(error)
      return res.status(error.status || 500).json({
        ok: false,
        msg: error.msg
      })
    }
  },
  getIdsLocal: async (req, res) => {
    try {
      let idsLocal = await db.Price.findAll({
        attributes: ['idLocal']
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
