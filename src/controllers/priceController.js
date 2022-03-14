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

      for (let i = 1; i <= totalPrices; i++) {
        let { amount } = await db.Price.findByPk(i, {
          attributes: ["amount"],
        });
        await db.Price.update(
          {
            amount: amount + amount * coefficient,
          },
          {
            where: { id: i },
          }
        );
      }

      let totalCloths = await db.Cloth.count();
      for (let i = 1; i <= totalCloths; i++) {
        let { price } = await db.Cloth.findByPk(i, {
          attributes: ["price"],
        });
        await db.Cloth.update(
          {
            price: price + price * coefficient,
          },
          {
            where: { id: i },
          }
        );
      }

      let totalChains = await db.Chain.count();
      for (let i = 1; i <= totalChains; i++) {
        let { price } = await db.Chain.findByPk(i, {
          attributes: ["price"],
        });
        await db.Chain.update(
          {
            price: price + price * coefficient,
          },
          {
            where: { id: i },
          }
        );
      }

      let totalPatterns = await db.Pattern.count();
      for (let i = 1; i <= totalPatterns; i++) {
        let { price } = await db.Pattern.findByPk(i, {
          attributes: ["price"],
        });
        await db.Pattern.update(
          {
            price: price + price * coefficient,
          },
          {
            where: { id: i },
          }
        );
      }

      let totalSupports = await db.Support.count();
      for (let i = 1; i <= totalSupports; i++) {
        let { price } = await db.Support.findByPk(i, {
          attributes: ["price"],
        });
        await db.Support.update(
          {
            price: price + price * coefficient,
          },
          {
            where: { id: i },
          }
        );
      }

      let totalSystems = await db.System.count();
      for (let i = 1; i <= totalSystems; i++) {
        let { price } = await db.System.findByPk(i, {
          attributes: ["price"],
        });
        await db.System.update(
          {
            price: price + price * coefficient,
          },
          {
            where: { id: i },
          }
        );
      }

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
