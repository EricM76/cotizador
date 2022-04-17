const db = require("../database/models");

module.exports = {
  index: (req, res) => {
    return res.render("prices");
  },
  editAll: (req, res) => {
    return res.render("priceAll");
  },
  editItem: (req, res) => {
    return res.render("priceItem");
  },
  add: (req, res) => {
    res.render("priceAdd");
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
  edit: (req, res) => {
    res.render("priceEdit");
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
};
