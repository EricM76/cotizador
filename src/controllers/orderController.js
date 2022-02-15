const xl = require("excel4node");
const moment = require("moment");

const db = require("../database/models");
const { Op } = require("sequelize");

module.exports = {
  index: (req, res) => {
    res.render("orders");
  },
  add: async (req, res) => {
    const quoters = JSON.parse(req.query.quoters).map((quoter) => +quoter);
    try {
      let items = await db.Quotation.findAll({
        where: {
          id: {
            [Op.in]: quoters,
          },
        },
        include: [{ all: true }],
      });

      return res.render("orderAdd", {
        items,
      });
    } catch (error) {
      console.log(error);
    }
  },
  store: async (req, res) => {
    let {
      id: ids,
      quantity: quantities,
      supportOrientation: supportOrientations,
      clothOrientation: clothOrientations,
      command: commands,
      observations,
    } = req.body;

    if (typeof ids === "string") {
      ids = [ids];
      quantities = [quantities];
      supportOrientations = [supportOrientations];
      clothOrientations = [clothOrientations];
      commands = [commands];
      observations = [observations];
    }

    try {
      let order = await db.Order.create({
        userId: req.session.userLogin.id,
        packaging: 200,
      });

      for (let i = 0; i < ids.length; i++) {
        await db.Quotation.update(
          {
            quantity: quantities[i],
            command: commands[i],
            supportOrientation: supportOrientations[i],
            clothOrientation: clothOrientations[i],
            observations: observations[i],
          },
          {
            where: {
              id: +ids[i],
            },
          }
        );
        await db.OrderQuotation.create({
          quotationId: +ids[i],
          orderId: order.id,
        });
      }

      return res.redirect("/orders/preview?order=" + order.id);
    } catch (error) {
      console.log(error);
    }
  },
  preview: async (req, res) => {
    db.Order.findOne({
      where: {
        id: +req.query.order,
      },
      include: [
        {
          association: "user",
          attributes: ["name", "surname"],
        },
        {
          association: "quotations",
          include: { all: true },
        },
      ],
    })
      .then((order) => {
        const names = order.quotations.map((quotation) => quotation.reference);

        const references = [...new Set(names)];

        const amounts = order.quotations.map(
          (quotation) => quotation.amount * quotation.quantity
        );

        const total = amounts.reduce((acum, num) => acum + num);

        return res.render("orderPreview", {
          order,
          user: order.user,
          quotations: order.quotations,
          references,
          total,
          toThousand: (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        });
      })
      .catch((error) => console.log(error));
  },
  send: async (req, res) => {
    try {
      await db.Order.update(
        {
          observations: req.body.observations,
        },
        {
          where: {
            id: +req.query.order,
          },
        }
      );
      let order = await db.Order.findOne({
        where: {
          id: +req.query.order,
        },
        include: [
          {
            association: "user",
            attributes: ["name", "surname"],
          },
          {
            association: "quotations",
            include: { all: true },
          },
        ],
      });
      if (order) {
        const names = order.quotations.map((quotation) => quotation.reference);
        const references = [...new Set(names)];

        let wb = new xl.Workbook();
        let ws = wb.addWorksheet("Orden: " + new Date().getTime());
        let style = wb.createStyle({
          font: {
            color: "#666666",
            size: 12,
          },
        });

        ws.cell(1, 1, 1, 5, true)
          .string(`VENDEDOR: ${order.user.name} ${order.user.surname}`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "left",
            },
          });
        ws.cell(2, 1, 2, 5, true)
          .string(`PEDIDO PARA : ${references.join(', ')}`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "left",
            },
          });

        ws.cell(1, 6, 2, 10, true)
        .string(`OBSERVACIONES PEDIDO : ${order.observations}`)
        .style(style)
        .style({
        alignment: {
            vertical: "center",
            horizontal: "left",
        },
        });

        ws.cell(1, 11, 2, 15, true)
        .string(`FECHA PEDIDO : ${moment().format('DD/MM/YY')}`)
        .style(style)
        .style({
        alignment: {
            vertical: "center",
            horizontal: "left",
        },
        });

        ws.row(1).setHeight(30);
        ws.row(2).setHeight(30);
        ws.column(1).setWidth(5); //cantidad
        ws.column(2).setWidth(15); //sistema
        ws.column(3).setWidth(15); //tela
        ws.column(4).setWidth(15); //color
        ws.column(5).setWidth(15); //ancho
        ws.column(6).setWidth(15); //alto
        ws.column(7).setWidth(15); //modelo
        ws.column(8).setWidth(15); //cadena
        ws.column(9).setWidth(15); //soporte
        ws.column(10).setWidth(15); //comando
        ws.column(11).setWidth(15); //o. soporte
        ws.column(12).setWidth(15); //o. tela
        ws.column(13).setWidth(15); //observaciones
        ws.column(14).setWidth(15); //p. unitario
        ws.column(15).setWidth(15); //total

        let titles = [
          "Cant",
          "Sistema",
          "Tela",
          "Color",
          "Ancho",
          "Alto",
          "Modelo",
          "Cadena",
          "Soporte",
          "Comando",
          "Orien. Soporte",
          "Orien. Tela",
          "Observaciones",
          "Precio unitario",
          "Total",
        ];

        titles.forEach((title, index) => {
          ws.cell(3, index + 1)
            .string(title)
            .style(style)
            .style({
              font: {
                bold: true,
              },
            });
        });
        let lastRow;
        order.quotations.forEach((quotation, index) => {
          index = index + 4;
          ws.cell(index, 1).number(quotation.quantity).style(style);
          ws.cell(index, 2).string(quotation.system.name).style(style);
          ws.cell(index, 3).string(quotation.cloth.name).style(style);
          ws.cell(index, 4).string(quotation.color.name).style(style);
          ws.cell(index, 5).number(quotation.clothWidth).style(style);
          ws.cell(index, 6).number(quotation.heigth).style(style);
          ws.cell(index, 7).string(quotation.pattern.name).style(style);
          ws.cell(index, 8).string(quotation.chain.name).style(style);
          ws.cell(index, 9).string(quotation.support.name).style(style);
          ws.cell(index, 10).string(quotation.command).style(style);
          ws.cell(index, 11).string(quotation.supportOrientation).style(style);
          ws.cell(index, 12).string(quotation.clothOrientation).style(style);
          ws.cell(index, 13).string(quotation.observations).style(style);
          ws.cell(index, 14).number(quotation.amount).style(style);
          ws.cell(index, 15)
            .number(quotation.amount * quotation.quantity)
            .style(style);
        lastRow = index + 1;
        });

        ws.cell(lastRow, 14, lastRow, 14, true)
        .string(`EMBALAJE: `)
        .style(style)
        .style({
        alignment: {
            vertical: "center",
            horizontal: "right",
        },
        });
        ws.cell(lastRow, 15, lastRow, 15, true)
        .number(order.packaging)
        .style(style)
        .style({
        alignment: {
            vertical: "center",
            horizontal: "right",
        },
        });

        const amounts = order.quotations.map(
            (quotation) => quotation.amount * quotation.quantity
          );
  
        const total = amounts.reduce((acum, num) => acum + num);

        ws.cell(lastRow + 1, 14, lastRow + 1, 14, true)
        .string(`TOTAL:`)
        .style(style)
        .style({
        alignment: {
            vertical: "center",
            horizontal: "right",
        },
        });
        ws.cell(lastRow + 1 , 15, lastRow +1, 15, true)
        .number(total + order.packaging)
        .style(style)
        .style({
        alignment: {
            vertical: "center",
            horizontal: "right",
        },
        });

        var fileClient = `${new Date().getTime()}.xlsx`;

        wb.write(`src/downloads/${fileClient}`);

        //planilla admin
        let ws2 = wb.addWorksheet("Orden: " + new Date().getTime() + " - admin")
      
          ws2.cell(1, 1, 1, 5, true)
            .string(`VENDEDOR: ${order.user.name} ${order.user.surname}`)
            .style(style)
            .style({
              alignment: {
                vertical: "center",
                horizontal: "left",
              },
            });
          ws2.cell(2, 1, 2, 5, true)
            .string(`PEDIDO PARA : ${references.join(', ')}`)
            .style(style)
            .style({
              alignment: {
                vertical: "center",
                horizontal: "left",
              },
            });
  
          ws2.cell(1, 6, 2, 10, true)
          .string(`OBSERVACIONES PEDIDO : ${order.observations}`)
          .style(style)
          .style({
          alignment: {
              vertical: "center",
              horizontal: "left",
          },
          });
  
          ws2.cell(1, 11, 2, 15, true)
          .string(`FECHA PEDIDO : ${moment().format('DD/MM/YY')}`)
          .style(style)
          .style({
          alignment: {
              vertical: "center",
              horizontal: "left",
          },
          });
  
          ws2.row(1).setHeight(30);
          ws2.row(2).setHeight(30);
          ws2.column(1).setWidth(5); //cantidad
          ws2.column(2).setWidth(15); //sistema
          ws2.column(3).setWidth(15); //tela
          ws2.column(4).setWidth(15); //color
          ws2.column(5).setWidth(15); //ancho
          ws2.column(6).setWidth(15); //alto
          ws2.column(7).setWidth(15); //modelo
          ws2.column(8).setWidth(15); //cadena
          ws2.column(9).setWidth(15); //soporte
          ws2.column(10).setWidth(15); //comando
          ws2.column(11).setWidth(15); //o. soporte
          ws2.column(12).setWidth(15); //o. tela
          ws2.column(13).setWidth(15); //observaciones
          ws2.column(14).setWidth(15); //p. unitario
          ws2.column(15).setWidth(15); //total
  
          titles.forEach((title, index) => {
            ws2.cell(3, index + 1)
              .string(title)
              .style(style)
              .style({
                font: {
                  bold: true,
                },
              });
          });
         
          order.quotations.forEach((quotation, index) => {
            index = index + 4;
            ws2.cell(index, 1).number(quotation.quantity).style(style);
            ws2.cell(index, 2).number(quotation.systemId).style(style);
            ws2.cell(index, 3).number(quotation.clothId).style(style);
            ws2.cell(index, 4).number(quotation.colorId).style(style);
            ws2.cell(index, 5).number(quotation.clothWidth).style(style);
            ws2.cell(index, 6).number(quotation.heigth).style(style);
            ws2.cell(index, 7).number(quotation.patternId).style(style);
            ws2.cell(index, 8).number(quotation.chainId).style(style);
            ws2.cell(index, 9).number(quotation.supportId).style(style);
            ws2.cell(index, 10).string(quotation.command).style(style);
            ws2.cell(index, 11).string(quotation.supportOrientation).style(style);
            ws2.cell(index, 12).string(quotation.clothOrientation).style(style);
            ws2.cell(index, 13).string(quotation.observations).style(style);
            ws2.cell(index, 14).number(quotation.amount).style(style);
            ws2.cell(index, 15)
              .number(quotation.amount * quotation.quantity)
              .style(style);
          lastRow = index + 1;
          });
  
          ws2.cell(lastRow, 14, lastRow, 14, true)
          .string(`EMBALAJE: `)
          .style(style)
          .style({
          alignment: {
              vertical: "center",
              horizontal: "right",
          },
          });
          ws2.cell(lastRow, 15, lastRow, 15, true)
          .number(order.packaging)
          .style(style)
          .style({
          alignment: {
              vertical: "center",
              horizontal: "right",
          },
          });
  
          ws2.cell(lastRow + 1, 14, lastRow + 1, 14, true)
          .string(`TOTAL:`)
          .style(style)
          .style({
          alignment: {
              vertical: "center",
              horizontal: "right",
          },
          });
          ws2.cell(lastRow + 1 , 15, lastRow +1, 15, true)
          .number(total + order.packaging)
          .style(style)
          .style({
          alignment: {
              vertical: "center",
              horizontal: "right",
          },
          });
  
          var fileAdmin = `${new Date().getTime()}.xlsx`;
  
          await db.Order.update(
              {
                fileClient,
                fileAdmin
              },
              {
                where: {
                  id: +req.query.order,
                },
              }
            );
  
          wb.write(`src/downloads/${fileAdmin}`);

        setTimeout(() => {
          return res.redirect("/");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  },
  createExcel: (req, res) => {

  },
  detail: (req, res) => {
    res.render("orderDetail");
  },
  edit: (req, res) => {
    res.render("orderEdit");
  },
  update: (req, res) => {
    res.render("orderUpdate");
  },
  remove: (req, res) => {
    res.render("orders");
  },
  search: (req, res) => {
    res.render("orders");
  },
  /* apis */
};
