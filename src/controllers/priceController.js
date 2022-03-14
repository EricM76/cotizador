const db = require("../database/models");

module.exports = {
  index: (req, res) => {
    return res.render("prices");
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
          return res.redirect("/prices?update=true");
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
          return res.redirect("/prices?create=true");
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
      let totalPrices = await db.Price.count();
      const Promises = [];
      for (let id = 1; id <= totalPrices; id++) {
        let { amount } = await db.Price.findByPk(id, {
          attributes: ["amount"],
        });

        const newPromise = await db.Price.update(
          { amount: amount + amount * coefficient },
          { where: { 
            id,
            visible : true 
          } }
        );
        Promises.push(newPromise);
      }

      let totalCloths = await db.Cloth.count();
      for (let id = 1; id <= totalCloths; id++) {
        let { price } = await db.Cloth.findByPk(id, {
          attributes: ["price"],
        });

        const newPromise = await db.Cloth.update(
          { price: price + price * coefficient },
          { where: { 
            id,
            visible : true 
          } }
        );
        Promises.push(newPromise);
      };

      let totalChains = await db.Chain.count();
      for (let id = 1; id <= totalChains; id++) {
        let { price } = await db.Chain.findByPk(id, {
          attributes: ["price"],
        });

        const newPromise = await db.Chain.update(
          { price: price + price * coefficient },
          { where: { 
            id,
            visible : true 
          } }
        );
        Promises.push(newPromise);
      };

      let totalPatterns = await db.Pattern.count();
      for (let id = 1; id <= totalPatterns; id++) {
        let { price } = await db.Pattern.findByPk(id, {
          attributes: ["price"],
        });

        const newPromise = await db.Pattern.update(
          { price: price + price * coefficient },
          { where: { 
            id,
            visible : true 
          } }
        );
        Promises.push(newPromise);
      };

      let totalSupports = await db.Support.count();
      for (let id = 1; id <= totalSupports; id++) {
        let { price } = await db.Support.findByPk(id, {
          attributes: ["price"],
        });

        const newPromise = await db.Support.update(
          { price: price + price * coefficient },
          { where: { 
            id,
            visible : true 
          } }
        );
        Promises.push(newPromise);
      };

      let totalSystems = await db.System.count();
      for (let id = 1; id <= totalSystems; id++) {
        let { price } = await db.System.findByPk(id, {
          attributes: ["price"],
        });

        const newPromise = await db.System.update(
          { price: price + price * coefficient },
          { where: { 
            id,
            visible : true 
          } }
        );
        Promises.push(newPromise);
      };

      await Promise.all(Promises);

    } catch (error) {
      console.log(error);
    }

    return res.redirect("/prices?updateAll=true");
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

      console.log("====================================");
      console.log(price);
      console.log("====================================");

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
