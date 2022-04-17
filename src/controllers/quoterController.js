const db = require("../database/models");
const moment = require("moment");
const { Op } = require("sequelize");
const { sequelize } = require("../database/models");

module.exports = {
  index: async (req, res) => {
    if (req.session.userLogin.rol === 1) {
      let total = await db.Quotation.count();
      let users = await db.Quotation.findAll({
        attributes: ["userId"],
        include: [{ association: "user" }],
        group: ["userId"],
        having: "",
      });

      db.Quotation.findAll({
        limit: 8,
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
        },
        limit: 8,
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
    let { order, filter, keywords, active, pages } = req.query;
    let items = [];
    let users = [];
    let total = 0;

    if (req.session.userLogin.rol === 1) {
      try {
        users = await db.Quotation.findAll({
          attributes: ["userId"],
          include: [{ association: "user" }],
          group: ["userId"],
          having: "",
        });
        if (filter === "all" || !filter) {
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
            order: [order || "id"],
            limit: 8,
            offset: active && +active * 8 - 8,
            include: { all: true },
          });
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
            order: [order || "id"],
            limit: 8,
            offset: active && +active * 8 - 8,
            include: { all: true },
          });
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
          order: [order || "id"],
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
          { association: "cloths", attributes: ["id", "name"] },
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
        large
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
        /* si el ancho y el alto son menores que 100 los fijo en 100 */
        width = +width < 100 ? 100 : +width;
        heigth = +heigth < 100 ? 100 : +heigth;

        console.log('====================================');
        console.log('ANCHO MINIMO', width);
        console.log('ALTO MINIMO', heigth);
        console.log('====================================');

        /* sumo 20 cm al alto y se multiplica ancho y por precio */
        amount = (+width / 100) * ((+heigth + 20) / 100) * amount;

        console.log('====================================');
        console.log('ANCHO', +width / 100);
        console.log('ALTO', (+heigth + 20) / 100);
        console.log('PRECIO X M2', amount.toFixed(0));
        console.log('====================================');

        /* obtengo el precio del modelo de cadena y lo sumo al monto */
        const pricePattern = await db.Pattern.findOne({
          where: {
            id: +pattern,
          },
        });
        amount = pricePattern && amount + pricePattern.price;

        console.log('====================================');
        console.log('MODELO', pricePattern.price);
        console.log('PRECIO + MODELO', amount);
        console.log('====================================');

        /* obtengo el precio del soporte y lo sumo al monto */
        const priceSupport = await db.Support.findOne({
          where: {
            id: +support,
          },
        });
        amount = priceSupport && amount + priceSupport.price;

        console.log('====================================');
        console.log('SOPORTE', priceSupport.price);
        console.log('PRECIO + SOPORTE', amount);
        console.log('====================================');

        /* obtengo el precio del largo de la cadena y lo sumo al monto */
        const priceChain = await db.Chain.findOne({
          where: {
            id: +chain,
          },
        });
        amount = priceChain ? amount + priceChain.price : amount;

        console.log('====================================');
        console.log('CADENA', priceChain.price);
        console.log('PRECIO + CADENA', amount);
        console.log('====================================');

        /* obtengo el precio de la grilla de medidas extras */
        //const priceGrid = await sequelize.query(`SELECT MAX(price) as price FROM Grids where width <= ${width} and heigth <= ${heigth};`);
        const priceGrid = await db.Grid.findOne({
          attributes: [[sequelize.fn('max', sequelize.col('price')), 'price']],
          where: {
            width,
            heigth
          },
          raw: true,
        });

        amount = priceGrid && amount + priceGrid.price;
        console.log('====================================');
        console.log('EXCEDENTE TAMAÑO', priceGrid.price);
        console.log('PRECIO MAS EXCEDENTE', amount);
        console.log('====================================');

        /* si la tela es eclipse se le suma el valor de la CENEFA */
        if (+cloth === 632) {
          /* divido el ancho por 100 para obtener decimales */
          widthByMeter = +width / 100;
          widthDecimal = widthByMeter.toString().slice(2)[0];
          widthDecimal = !widthDecimal ? '0' : widthDecimal;

          let decimal;
          let entero;
          /* segun el decimal determino el ancho */
          switch (widthDecimal) {
            case '1':
            case '2':
              decimal = 2
              entero = Math.trunc(widthByMeter);
              width = entero + decimal / 10;
              break;
            case '3':
            case '4':
              decimal = 4
              entero = Math.trunc(widthByMeter);
              width = entero + decimal / 10;
              break;
            case '5':
            case '6':
              decimal = 6
              entero = Math.trunc(widthByMeter);
              width = entero + decimal / 10;
              break;
            case '7':
            case '8':
              decimal = 8
              entero = Math.trunc(widthByMeter);
              width = entero + decimal / 10;
              break;
            case '9':
              decimal = 0
              entero = Math.trunc(widthByMeter);
              width = entero + 1;
              break
            case '0':
              decimal = 0
              entero = Math.trunc(widthByMeter);
              width = entero;
              break
            default:
              break;
          }
          console.log('====================================');
          console.log('ANCHO EN METROS:', widthByMeter);
          console.log('DECIMAL', widthDecimal);
          console.log('ANCHO TOTAL', width);
          console.log('====================================');

          let priceCenefa = await db.Price.findOne({
            where: {
              systemId: 127, //cenefa
              clothId: 626, //ninguno
              colorId: 17, //ninguno
              visible: true,
            },
            include: { all: true }
          })

          console.log('====================================');
          console.log('PRECIO', amount);
          console.log('ANCHO CENEFA', width);
          console.log('PRECIO CENEFA', priceCenefa.amount);
          console.log('====================================');
          amount = width < 1 ? amount + priceCenefa.amount : amount + (width * priceCenefa.amount)
        }

      }

      /* ************************************************ */
      /*                    ROMANAS                       */
      /* ************************************************ */

      if (+system === 111) {
        let area;
        /* agrego 20 al ancho original, para hacer el cálculo del ancho mímino */
        width = +width + 20 < 120 ? 100 : +width;

        /* si el ancho es mayor o igual que 120, el ancho queda como viene */
        heigth = +heigth < 120 ? 100 : +heigth;

        /* sumo 20 al ancho y al alto y los multiplico */
        area = ((width + 20) / 100) * ((heigth + 20) / 100);

        console.log('====================================');
        console.log('AREA', area);
        console.log('====================================');

        /* si la superficie es menor a dos, lo fijo en dos o queda se redondea el decimal en cinco o se suma un entero */
        if (area < 2) {
          area = 2
        } else {
          area = area.toFixed(1);
          console.log('====================================');
          console.log('AREA SUPERIOR A 2 m', area);
          console.log('====================================');
          /* extraigo el decimal */
          areaDecimal = area.toString().slice(2)[0];
          console.log('====================================');
          console.log('DECIMAL DEL AREA', areaDecimal);
          console.log('====================================');
          /* si existe un decimal en el area */
          let decimal;
          let entero;
          if (areaDecimal) {
            if (+areaDecimal <= 5) {
              decimal = 5;
              entero = Math.trunc(+areaDecimal);
              area = entero + decimal / 10;
              console.log('====================================');
              console.log('DECIMAL REDONDEADO EN 5', area);
              console.log('====================================');
            } else {
              decimal = 0;
              entero = Math.trunc(+area);
              area = entero + 1;
              console.log('====================================');
              console.log('SIGUIENTE ENTERO', entero, area);
              console.log('====================================');
            }
          }
        }
        /* calculo el precio multiplicando el area por el precio de base */
        amount = amount * area;
        console.log('====================================');
        console.log('PRECIO x AREA', amount);
        console.log('====================================');

        if (+pattern === 1 || +pattern === 2) {

          /* divido el ancho por 100 para obtener decimales */
          let widthByMeter = +width / 100;
          widthDecimal = widthByMeter.toString().slice(2)[0];
          widthDecimal = !widthDecimal ? '0' : widthDecimal;

          switch (widthDecimal) {
            case '1':
            case '2':
              decimal = 2
              entero = Math.trunc(widthByMeter);
              width = entero + decimal / 10;
              break;
            case '3':
            case '4':
              decimal = 4
              entero = Math.trunc(widthByMeter);
              width = entero + decimal / 10;
              break;
            case '5':
            case '6':
              decimal = 6
              entero = Math.trunc(widthByMeter);
              width = entero + decimal / 10;
              break;
            case '7':
            case '8':
              decimal = 8
              entero = Math.trunc(widthByMeter);
              width = entero + decimal / 10;
              break;
            case '9':
              decimal = 0
              entero = Math.trunc(widthByMeter);
              width = entero + 1;
              break
            case '0':
              decimal = 0
              entero = Math.trunc(widthByMeter);
              width = entero;
              break
            default:
              break;
          }

          console.log('====================================');
          console.log('ANCHO EN METROS:', widthByMeter);
          console.log('DECIMAL', widthDecimal);
          console.log('ANCHO TOTAL', width);
          console.log('====================================');

          /* cual sea el ancho?? se multiplica por 1.50 el monto */
          if (width < 1) {
            amount = amount * 1.50;
          } else {
            amount = amount * 1.50;
          }

          console.log('====================================');
          console.log('EL PRECIO SE MULTIPLICA x 1.50:', amount);
          console.log('====================================');

          /* obtengo el precio del modelo de cadena y lo sumo al monto */
          const pricePattern = await db.Pattern.findOne({
            where: {
              id: +pattern,
            },
          });
          amount = pricePattern && amount + pricePattern.price;

          console.log('====================================');
          console.log('SOPORTE', pricePattern.price);
          console.log('PRECIO + MODELO', amount);
          console.log('====================================');

          /* obtengo el precio del largo de la cadena y lo sumo al monto */
          const priceChain = await db.Chain.findOne({
            where: {
              id: +chain,
            },
          });
          amount = priceChain ? amount + priceChain.price : amount;

          console.log('====================================');
          console.log('SOPORTE', priceChain.price);
          console.log('PRECIO + LARGO CADENA', amount);
          console.log('====================================');
        }
      }
      /* ************************************************ */
      /*              PANELES ORIENTALES                  */
      /* ************************************************ */

      if (+system === 112) {

        /* segun el ancho calculo la cantidad de paños */
        let quantity = +width < 210 ? 3 : +width >= 210 && +width < 300 ? 4 : 5;
        console.log('====================================');
        console.log('CANTIDAD DE PAÑOS', quantity);
        console.log('====================================');

        /* calculo el ancho de paño, dividiendo el ancho por la cantidad de paños */
        let widthPanel = +width / quantity;
        console.log('====================================');
        console.log('ANCHO DEL PANEL', widthPanel);
        console.log('====================================');

        /* si el ancho de paño es menor a 100, lo fijo en 100 */
        widthPanel = widthPanel < 100 ? 100 : widthPanel;
        console.log('====================================');
        console.log('ANCHO MINIMO DEL PANEL', widthPanel);
        console.log('====================================');

        /* si el alto de paño es menor a 150, lo fijo en 150 */
        let heightPanel = +heigth < 150 ? 150 : +heigth;
        console.log('====================================');
        console.log('ALTO MINIMO DEL PANEL', widthPanel);
        console.log('====================================');

        /* sumo 20 al alto del panel */
        heightPanel = heightPanel + 20;
        console.log('====================================');
        console.log('ALTO + 20', heightPanel);
        console.log('====================================');

        /* calculo los metros cuadrados */
        let area = (heightPanel / 100) * (widthPanel / 100)
        console.log('====================================');
        console.log('AREA EN M2', area);
        console.log('====================================');

        /* calculo el precio */
        amount = amount * area * quantity;
        console.log('====================================');
        console.log('PRECIO x AREA x CANTIDAD DE PANELES', amount);
        console.log('====================================');

        /* calculo de ancho de riel */
        let widthByMeter = +width / 100;
        widthDecimal = widthByMeter.toString().slice(2)[0];
        widthDecimal = !widthDecimal ? '0' : widthDecimal;

        switch (widthDecimal) {
          case '1':
          case '2':
            decimal = 2
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '3':
          case '4':
            decimal = 4
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '5':
          case '6':
            decimal = 6
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '7':
          case '8':
            decimal = 8
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '9':
            decimal = 0
            entero = Math.trunc(widthByMeter);
            width = entero + 1;
            break
          case '0':
            decimal = 0
            entero = Math.trunc(widthByMeter);
            width = entero;
            break
          default:
            break;
        }

        /* sumo al monto el valor del riel. El mismo es el resultado del ancho obtenido x 463 */
        amount = amount + (width * 463);
        console.log('====================================');
        console.log('ANCHO FINAL', width);
        console.log('PRECIO RIELES (ANCHO x 463)', width * 463);
        console.log('PRECIO FINAL (PRECIO + PRECIO RIELES)', amount)
        console.log('====================================');
      }
      /* ************************************************ */
      /* TRIPLE PELLIZCO, PELLIZCO SIMPLE, PELLIZCO DOBLE */
      /* ************************************************ */

      if (+system === 116 || +system === 129 || +system === 130) {

        /* 
        falta fijar un alto mínimo
        */

        /* si el ancho es menor a 100, lo fijo en 100 */
        width = +width < 100 ? 100 : +width;
        console.log('====================================');
        console.log('ANCHO MINIMO', width);
        console.log('====================================');

        /* redondeo del decimal el ancho */
        let widthByMeter = +width / 100;
        widthDecimal = widthByMeter.toString().slice(2)[0];
        widthDecimal = !widthDecimal ? '0' : widthDecimal;

        switch (widthDecimal) {
          case '1':
          case '2':
            decimal = 2
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '3':
          case '4':
            decimal = 4
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '5':
          case '6':
            decimal = 6
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '7':
          case '8':
            decimal = 8
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '9':
            decimal = 0
            entero = Math.trunc(widthByMeter);
            width = entero + 1;
            break
          case '0':
            decimal = 0
            entero = Math.trunc(widthByMeter);
            width = entero;
            break
          default:
            break;
        }

        /* si es pellizco simple o triple el ancho se multiplica por 3 y si es pellizco doble se multplica por 2 */
        width = +system === 129 || +system === 116 ? (width * 3) : (width * 2);

        console.log('====================================');
        console.log('ANCHO MULTIPLICADO SEGÚN SISTEMA', width);
        console.log('====================================');

        /* 
        falta calcular la superficie
        */

        let area = width * (heigth / 100);
        console.log('====================================');
        console.log('SUPERFICIE TOTAL', area);
        console.log('====================================');

        /* si el ancho es menor que un metro se le suma el precio del riel (HAY QUE ACTUALILZARLO), de lo contrario, si es mayor que un metro se multiplica el ancho por el precio del riel (HAY QUE ACTUALIZARLO) + el precio */

        const railPrice = 50;
        amount = width < 1 ? amount + railPrice : amount + (width * railPrice);

        console.log('====================================');
        console.log('VALOR DEL RIEL', railPrice);
        console.log('PRECIO + VALOR DEL RIEL', amount);
        console.log('====================================');
        /* 
        calculo el precio final
        */
        amount = amount * area;
        console.log('====================================');
        console.log('PRECIO FINAL', amount);
        console.log('====================================');
      }

      /* ************************************************ */
      /*                     CENEFAS                      */
      /* ************************************************ */


      if (+system === 127) {

        /* si el ancho es menor a 100, lo fijo en 100 */
        width = +width < 100 ? 100 : +width;
        console.log('====================================');
        console.log('ANCHO MINIMO', width);
        console.log('====================================');

        /* redondeo del decimal el ancho */
        let widthByMeter = +width / 100;
        widthDecimal = widthByMeter.toString().slice(2)[0];
        widthDecimal = !widthDecimal ? '0' : widthDecimal;

        switch (widthDecimal) {
          case '1':
          case '2':
            decimal = 2
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '3':
          case '4':
            decimal = 4
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '5':
          case '6':
            decimal = 6
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '7':
          case '8':
            decimal = 8
            entero = Math.trunc(widthByMeter);
            width = entero + decimal / 10;
            break;
          case '9':
            decimal = 0
            entero = Math.trunc(widthByMeter);
            width = entero + 1;
            break
          case '0':
            decimal = 0
            entero = Math.trunc(widthByMeter);
            width = entero;
            break
          default:
            break;
        }

        /* calculo el precio multiplicando el ancho obtenido por el precio */
        amount = width * amount;

      }

      /* ************************************************ */
      /*                 GUIAS (laterales)                */
      /* ************************************************ */

      if (+system === 114) {

        /* 
        fijo el largo mímino
        */
        large = +large < 100 ? 100 : +large;
        console.log('====================================');
        console.log('LARGO MINIMO', large);
        console.log('====================================');

        /* redondeo del decimal el alto */
        let largeByMeter = +large / 100;
        largeDecimal = largeByMeter.toString().slice(2)[0];
        largeDecimal = !largeDecimal ? '0' : largeDecimal;

        switch (largeDecimal) {
          case '1':
          case '2':
            decimal = 2
            entero = Math.trunc(largeByMeter);
            large = entero + decimal / 10;
            break;
          case '3':
          case '4':
            decimal = 4
            entero = Math.trunc(largeByMeter);
            large = entero + decimal / 10;
            break;
          case '5':
          case '6':
            decimal = 6
            entero = Math.trunc(largeByMeter);
            large = entero + decimal / 10;
            break;
          case '7':
          case '8':
            decimal = 8
            entero = Math.trunc(largeByMeter);
            large = entero + decimal / 10;
            break;
          case '9':
            decimal = 0
            entero = Math.trunc(largeByMeter);
            large = entero + 1;
            break
          case '0':
            decimal = 0
            entero = Math.trunc(largeByMeter);
            large = entero;
            break
          default:
            break;
        }

        /* calculo el precio multiplicando el alto obtenido por el precio */
        amount = large * amount;

      }

      /* ************************************************ */
      /*                 BANDAS VERTICALES                */
      /* ************************************************ */

      if (+system === 179) {

        /* si el ancho es menor a 100, lo fijo en 100 */
        width = width < 100 ? 100 : width;
        console.log('====================================');
        console.log('ANCHO MINIMO', width);
        console.log('====================================');

        /* si el alto es menor a 150, lo fijo en 150 */
        heigth = +heigth < 150 ? 150 : +heigth;
        console.log('====================================');
        console.log('ALTO MINIMO', heigth);
        console.log('====================================');

        /* sumo a 5 cm al ancho y al alto */
        width = width + 5;
        heigth = heigth + 5;

        /* calculo la superficie y lo expreso en m2 */
        let area = (width / 100) * (heigth / 100);

        /* si la superficie es menor a dos, lo fijo en dos o queda se redondea el decimal en cinco o se suma un entero */
        if (area < 2) {
          area = 2
        } else {
          area = area.toFixed(1);
          console.log('====================================');
          console.log('AREA SUPERIOR A 2 m', area);
          console.log('====================================');
          /* extraigo el decimal */
          areaDecimal = area.toString().slice(2)[0];
          console.log('====================================');
          console.log('DECIMAL DEL AREA', areaDecimal);
          console.log('====================================');
          /* si existe un decimal en el area */
          let decimal;
          let entero;
          if (areaDecimal) {
            if (+areaDecimal <= 5) {
              decimal = 5;
              entero = Math.trunc(+areaDecimal);
              area = entero + decimal / 10;
              console.log('====================================');
              console.log('DECIMAL REDONDEADO EN 5', area);
              console.log('====================================');
            } else {
              decimal = 0;
              entero = Math.trunc(+area);
              area = entero + 1;
              console.log('====================================');
              console.log('SIGUIENTE ENTERO', entero, area);
              console.log('====================================');
            }
          }
        }
        /* calculo el precio multiplicando precio x superficie */
        amount = amount * area;

        /* obtengo el precio del largo de la cadena y lo sumo al monto */
        const priceChain = await db.Chain.findOne({
          where: {
            id: +chain,
          },
        });
        amount = priceChain ? amount + priceChain.price : amount;

        console.log('====================================');
        console.log('CADENA', priceChain.price);
        console.log('PRECIO + CADENA', amount);
        console.log('====================================');
      }

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

      if (amount) {
        let quotation;
        if (req.session.userLogin.rol > 2) {
          quotation = await db.Quotation.create({
            clothWidth: +width,
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
          data: amount.toFixed(0),
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
  quoterUpdate: async (systemId, clothId, colorId, supportId, patternId, chainId, width, heigth) => {
    try {

      const price = await db.Price.findOne({
        where: {
          systemId,
          clothId,
          colorId,
          visible: true,
        },
      });

      const grid = await db.Grid.findOne({
        where: {
          width,
          heigth,
          visible: true,
        },
      });

      const priceSystem = await db.System.findOne({
        where: {
          id: systemId,
        },
      });
      const priceCloth = await db.Cloth.findOne({
        where: {
          id: clothId,
        },
      });

      const priceSupport = await db.Support.findOne({
        where: {
          id: supportId,
        },
      });

      const pricePattern = await db.Pattern.findOne({
        where: {
          id: patternId,
        },
      });

      const priceChain = await db.Chain.findOne({
        where: {
          id: chainId,
        },
      });

      let data = null;

      if (price) {
        if (grid) {
          data = price.amount + grid.price;
        }
        if (priceSystem) {
          data = data + priceSystem.price;
        }
        if (priceCloth) {
          data = data + priceCloth.price;
        }
        if (priceSupport) {
          data = data + priceSupport.price;
        }
        if (pricePattern) {
          data = data + pricePattern.price;
        }
        if (priceChain) {
          data = data + priceChain.price;
        }
      }

      return data

    } catch (error) {
      console.log(error);
    }
  }
};
