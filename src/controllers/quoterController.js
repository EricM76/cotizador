const db = require("../database/models");
const moment = require("moment");
const { Op } = require("sequelize");
const { sequelize } = require("../database/models");

/* calculadores de precio */

const getPriceRoller = require('../helpers/getPriceRoller');
const getPriceRomanas = require("../helpers/getPriceRomanas");
const getPricePaneles = require("../helpers/getPricePaneles");
const getPricePellizcos = require("../helpers/getPricePellizcos");
const getPriceCenefa = require("../helpers/getPriceCenefa");
const getPriceGuias = require("../helpers/getPriceGuias");
const getPriceBandas = require("../helpers/getPriceBandas");

module.exports = {
  index: async (req, res) => {
    if (req.session.userLogin.rol === 1 || req.session.userLogin.rol === 2) {
      let total = await db.Quotation.count();
      let users = await db.Quotation.findAll({
        attributes: ["userId"],
        include: [{ association: "user"}],
        group: ["userId"],
        having: "",
      });
     
      db.Quotation.findAll({
        limit: 8,
        order : [['updatedAt','DESC']],
        include: { all: true },
      })
        .then((items) => {
          return res.render("quotations", {
            items,
            total,
            active: 1,
            pages: 1,
            keywords: "",
            multiplo: total % 8 === 0 ? 0 : 1,
            moment,
            users,
            typeUser : 2
          });
        })
        .catch((error) => console.log(error));
    } else {
      let total = await db.Quotation.count({
        where: {
          userId: req.session.userLogin.id,
        },
      });
      let references = await db.Quotation.findAll({
        where: {
          userId: req.session.userLogin.id,
        },
        attributes: ["reference"],
        group: ["reference"],
        having: "",
      });

      db.Quotation.findAll({
        where: {
          userId: req.session.userLogin.id,
          date : {
            [Op.gte]: moment().subtract(30, 'days').toDate()
          }
        },
        limit: 8,
        order : [['updatedAt','DESC']],
        include: { all: true },
      })
        .then((items) => {
          return res.render("quotations", {
            items,
            total,
            active: 1,
            pages: 1,
            keywords: "",
            multiplo: total % 8 === 0 ? 0 : 1,
            moment,
            references,
          });
        })
        .catch((error) => console.log(error));
    }
  },
  add: (req, res) => {

    let systems = db.System.findAll({
      where: {
        visible: true,
      },
      order: ["name"],
    })
    let rols = db.Rol.findAll()
    Promise.all([systems, rols])
      .then(([systems, rols]) => {
        return res.render("quoter", {
          systems,
          rols
        });
      })
      .catch((error) => console.log(error));
  },
  store: (req, res) => {
    console.log("guardando...");
    //res.render('quoters')
  },
  detail: (req, res) => {
    res.render("quoterDetail");
  },
  edit: (req, res) => {
    res.render("quoterEdit");
  },
  update: (req, res) => {
    res.render("quoterUpdate");
  },
  remove: (req, res) => {
    res.render("quoters");
  },
  search: async (req, res) => {
    const { keywords, filter } = req.query;
    let items = [];
    let total = 0;
    try {
      let users = await db.Quotation.findAll({
        attributes: ["userId"],
        include: [{ association: "user" }],
        group: ["userId"],
        having: "",
      });
      if (!filter || filter === "all") {
        total = await db.Quotation.count({
          where: {
            reference: {
              [Op.substring]: keywords,
            },
          },
        });
        items = await db.Quotation.findAll({
          where: {
            reference: {
              [Op.substring]: keywords,
            },
          },
          limit: 8,
          include: { all: true },
        });
      } else {
        total = await db.Quotation.count({
          where: {
            reference: {
              [Op.substring]: keywords,
            },
            userId: filter,
          },
        });
        items = await db.Quotation.findAll({
          where: {
            reference: {
              [Op.substring]: keywords,
            },
            userId: filter,
          },
          limit: 8,
          include: { all: true },
        });
      }
      return res.render("quotations", {
        items,
        total,
        active: 1,
        pages: 1,
        keywords: "",
        multiplo: total % 8 === 0 ? 0 : 1,
        moment,
        users,
      });
    } catch (error) {
      console.log(error);
    }
  },
  filter: async (req, res) => {
    let { order, filter, keywords, active, pages, typeUser } = req.query;
    let items = [];
    let users = [];
    let total = 0;

    if (req.session.userLogin.rol === 1 || req.session.userLogin.rol === 2) {
      try {
        users = await db.Quotation.findAll({
          attributes: ["userId"],
          include: [{ association: "user" }],
          group: ["userId"],
          having: "",
        });
      

        users.sort((a,b) => a.user.username > b.user.username ? 1 : a.user.username < b.user.username ? -1  : 0)

        users = typeUser < 2 ? users.filter(item => item.user.enabled == typeUser) : users;

    
        if (typeUser == 2 && !filter) {
          total = await db.Quotation.count({
            where: {
              reference: {
                [Op.substring]: keywords,
              },
            },
          });
          items = await db.Quotation.findAll({
            where: {
              reference: {
                [Op.substring]: keywords,
              },
            },
            order : [['updatedAt','DESC']],
            limit: 8,
            offset: active && +active * 8 - 8,
            include: { all: true },
          });
        } else if(typeUser < 2 && !filter){
          total = await db.Quotation.count({
            where: {
              reference: {
                [Op.substring]: keywords,
              },
            },
            include : [
              {
                association : 'user',
                where : {
                  enabled : typeUser
                }
              }
            ]
          });
          items = await db.Quotation.findAll({
            where: {
              reference: {
                [Op.substring]: keywords,
              },
            },
            order : [['updatedAt','DESC']],
            limit: 8,
            offset: active && +active * 8 - 8,
            include: { all: true },
          });
          items = items.filter(item => item.user.enabled == typeUser)
        } else {
          total = await db.Quotation.count({
            where: {
              userId: +filter,
              reference: {
                [Op.substring]: keywords,
              },
            },
          });
          items = await db.Quotation.findAll({
            where: {
              userId: +filter,
              reference: {
                [Op.substring]: keywords,
              },
            },
            order : [['updatedAt','DESC']],
            limit: 8,
            offset: active && +active * 8 - 8,
            include: { all: true },
          });
          //total = items.length;
        }
        return res.render("quotations", {
          items,
          total,
          active,
          pages,
          keywords,
          multiplo: total % 8 === 0 ? 0 : 1,
          moment,
          users,
          typeUser
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", keywords);
        total = await db.Quotation.count({
          where: {
            userId: req.session.userLogin.id,
            reference: {
              [Op.substring]: keywords,
            },
          },
        });
        items = await db.Quotation.findAll({
          where: {
            userId: req.session.userLogin.id,
            reference: {
              [Op.substring]: keywords,
            },
          },
          order : [['updatedAt','DESC']],
          limit: 8,
          offset: active && +active * 8 - 8,
          include: { all: true },
        });

        return res.render("quotations", {
          items,
          total,
          active,
          pages,
          keywords,
          multiplo: total % 8 === 0 ? 0 : 1,
          moment,
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
  //APIS
  load: async (req, res) => {
    try {
      const system = await db.System.findByPk(req.params.id, {
        include: [
          { association: "chains", attributes: ["id", "name"] },
          { association: "cloths", attributes: ["id", "name","width", "traversedCut"] },
          { association: "colors", attributes: ["id", "name"] },
          { association: "patterns", attributes: ["id", "name"] },
          { association: "supports", attributes: ["id", "name"] },

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
  quote: async (req, res) => {

    try {
      let {
        system,
        cloth,
        color,
        support,
        pattern,
        chain,
        width,
        railWidth,
        heigth,
        reference,
        large,
        lineBlack
      } = req.body;

      const price = await db.Price.findOne({
        where: {
          systemId: +system,
          clothId: +cloth,
          colorId: +color,
          visible: true,
        },
        include: { all: true }
      });

      let amount = price && price.amount;
      console.log('====================================');
      console.log('RESULTADO:::::', amount);
      console.log('====================================');
      if (!amount) {
        return res.status(200).json({
          ok: false
        })
      }

      console.log('====================================');
      console.log('SISTEMA', +system, price.system.name);
      console.log('TELA', +cloth, price.cloth.name);
      console.log('COLOR', +color, price.color.name);
      console.log('PRECIO', amount);
      console.log('====================================');

      /* ************************************************ */
      /*                     ROLLER                       */
      /* ************************************************ */

      if (+system === 113) {

        amount = await getPriceRoller(width, heigth, amount, cloth, pattern, support, chain)
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                     VISILLO                       */
      /* ************************************************ */

      if (+system === 119) {

        amount = await getPriceRoller(width, heigth, amount, cloth, pattern, support, chain);
        amount = amount - (amount * 0.06)
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                    ROMANAS                       */
      /* ************************************************ */

      if (+system === 111) {

        amount = await getPriceRomanas(width, heigth, amount, pattern, chain);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }
      /* ************************************************ */
      /*              PANELES ORIENTALES                  */
      /* ************************************************ */

      if (+system === 112) {

        amount = await getPricePaneles(width, heigth, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }
      /* ************************************************ */
      /* TRIPLE PELLIZCO, PELLIZCO SIMPLE, PELLIZCO DOBLE */
      /* ************************************************ */

      if (+system === 116 || +system === 129 || +system === 130) {

        amount = await getPricePellizcos(system, width, heigth, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ********************************* */
      /* TABLA ENCONTRADA, CABEZAL PLIZADO */
      /* ********************************* */

      if (+system === 133 || +system === 18) {

        amount = await getPricePellizcos(system, width, heigth, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                     CENEFAS                      */
      /* ************************************************ */


      if (+system === 127) {

        amount = await getPriceCenefa(large, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                 GUIAS (laterales)                */
      /* ************************************************ */

      if (+system === 114) {

        amount = await getPriceGuias(large, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                 BANDAS VERTICALES                */
      /* ************************************************ */

      if (+system === 179) {

        amount = await getPriceBandas(railWidth, heigth, amount, chain, pattern);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                     LINEA BLACK                  */
      /* ************************************************ */

      if (+lineBlack === 1) {

        let {price} = await db.Package.findByPk(2);
        amount = amount + (amount * price / 100)
        
      }

      /* CALCULO SEGÚN EL ROL DEL VENDEDOR */
      amount = req.session.userLogin.coefficient !== 0 ? amount + amount * req.session.userLogin.coefficient : amount;
      let data;
      if (+req.session.userLogin.rol === 2 || +req.session.userLogin.rol === 1) {
        let rolSelected = await db.Rol.findByPk(req.body.rol);
        console.log('====================================');
        console.log('ID ROL',req.body.rol);
        console.log('COEFICIENTE',rolSelected.coefficient);
        console.log('====================================');
        data = amount + amount * +rolSelected.coefficient;
        console.log('====================================');
        console.log('PRECIO NORMAL',amount);
        console.log('PRECIO SEGÚN ROL',data);
        console.log('====================================');
      }

      if (amount) {
        let quotation;
        if (req.session.userLogin.rol > 2) {
          console.log('====================================');
          console.log(+width);
          console.log('====================================');
          quotation = await db.Quotation.create({
            clothWidth: +large !== 0 ? +large : +railWidth !== 0 ? +railWidth : +width,
            heigth: +heigth,
            amount: amount.toFixed(0),
            date: new Date(),
            reference,
            systemId: +system,
            clothId: +cloth,
            colorId: +color,
            supportId: +support,
            patternId: +pattern,
            chainId: +chain,
            userId: req.session.userLogin.id,
          });
        }

        return res.status(200).json({
          ok: true,
          data: data ? data.toFixed(0) : amount.toFixed(0),
          quotation,
          rol: req.session.userLogin.rol
        });

      } else {
        return res.status(200).json({
          ok: false
        })
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
  getUsers: async (req, res) => {
    try {
      let users = await db.Quotation.findAll({
        attributes: ["userId"],
        include: [
          {
            association: "user",
            attributes: ["name"],
          },
        ],
        group: ["userId"],
        having: "",
      });

      return res.status(200).json({
        ok: true,
        data: users,
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
  quoterUpdate: async (req,systemId, clothId, colorId, supportId, patternId, chainId, width, heigth) => {

    console.log('====================================');
    console.log('SYSTEM',systemId);
    console.log('CLOTH',clothId);
    console.log('COLOR',supportId);
    console.log('SUPPORT',supportId);
    console.log('PATTERN',patternId);
    console.log('CHAIN',chainId);
    console.log('WIDTH',width);
    console.log('HEIGTH',heigth);
    console.log('====================================');

    let system = systemId;
    let cloth = clothId;
    let color = colorId;
    let support = supportId;
    let pattern = patternId;
    let chain = chainId

    try {

      const price = await db.Price.findOne({
        where: {
          systemId: +system,
          clothId: +cloth,
          colorId: +color,
          visible: true,
        },
        include: { all: true }
      });

      let amount = price && price.amount;
      console.log('====================================');
      console.log('RESULTADO:::::', amount);
      console.log('====================================');

      if (!amount) {
        return null
      }

      console.log('====================================');
      console.log('SISTEMA', +system, price.system.name);
      console.log('TELA', +cloth, price.cloth.name);
      console.log('COLOR', +color, price.color.name);
      console.log('PRECIO', amount);
      console.log('====================================');

      /* ************************************************ */
      /*                     ROLLER                       */
      /* ************************************************ */

      if (+system === 113) {

        amount = await getPriceRoller(width, heigth, amount, cloth, pattern, support, chain)
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                     VISILLO                       */
      /* ************************************************ */

      if (+system === 119) {

        amount = await getPriceRoller(width, heigth, amount, cloth, pattern, support, chain);
        amount = amount - (amount * 0.06)
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                    ROMANAS                       */
      /* ************************************************ */

      if (+system === 111) {

        amount = await getPriceRomanas(width, heigth, amount, pattern, chain);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }
      /* ************************************************ */
      /*              PANELES ORIENTALES                  */
      /* ************************************************ */

      if (+system === 112) {

        amount = await getPricePaneles(width, heigth, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }
      /* ************************************************ */
      /* TRIPLE PELLIZCO, PELLIZCO SIMPLE, PELLIZCO DOBLE */
      /* ************************************************ */

      if (+system === 116 || +system === 129 || +system === 130) {

        amount = await getPricePellizcos(system, width, heigth, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ********************************* */
      /* TABLA ENCONTRADA, CABEZAL PLIZADO */
      /* ********************************* */

      if (+system === 133 || +system === 18) {

        amount = await getPricePellizcos(system, width, heigth, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                     CENEFAS                      */
      /* ************************************************ */


      if (+system === 127) {

        amount = await getPriceCenefa(width, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                 GUIAS (laterales)                */
      /* ************************************************ */

      if (+system === 114) {

        amount = await getPriceGuias(width, amount);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');

      }

      /* ************************************************ */
      /*                 BANDAS VERTICALES                */
      /* ************************************************ */

      if (+system === 179) {

        amount = await getPriceBandas(width, heigth, amount, chain, pattern);
        console.log('====================================');
        console.log('RESULTADO FUNCIÓN', amount)
        console.log('====================================');
        
      }

      /* ************************************************ */
      /*                     LINEA BLACK                  */
      /* ************************************************ */

    /*   if (+lineBlack === 1) {

        let {price} = await db.Package.findByPk(2);
        amount = amount + (amount * price / 100)
        
      } */

      /* CALCULO SEGÚN EL ROL DEL VENDEDOR */
      amount = req.session.userLogin.coefficient !== 0 ? amount + amount * req.session.userLogin.coefficient : amount;

      if (req.session.userLogin.rol === 2) {
        let rolSelected = await db.Rol.findByPk(req.body.rol);
        console.log('====================================');
        console.log(rolSelected);
        console.log('====================================');
        data = amount + amount * +rolSelected.coefficient;
        console.log('====================================');
        console.log(amount);
        console.log('====================================');
      }

      return amount

    } catch (error) {
      console.log(error);
    }
  }
};
