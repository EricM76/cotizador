const path = require("path");
const xl = require("excel4node");
const moment = require("moment");
const { SMTPClient, Message } = require("emailjs");
const { Op } = require("sequelize");

const fonts = require("../fonts/Roboto");
const PdfPrinter = require("pdfmake");
const printer = new PdfPrinter(fonts);
const fs = require("fs");

const db = require("../database/models");

const client = new SMTPClient({
  user: "cotizadorblancomad@gmail.com",
  password: "cotizador2022",
  host: "smtp.gmail.com",
  ssl: true,
  timeout: 10000,
});

module.exports = {
  index: (req, res) => {
    let users = db.Quotation.findAll({
      attributes: ["userId"],
      include: [{ association: "user" }],
      group: ["userId"],
      having: "",
    });
    let items = db.Order.findAll({
      include: [
        {
          association: "quotations",
          include: { all: true },
        },
        { association: "user" },
      ],
      order: [["createdAt", "DESC"]],
      limit: 8,
    });
    let total = db.Order.count();
    Promise.all([users, items, total])
      .then(([users, items, total]) => {
        return res.render("orders", {
          items,
          users,
          total,
          active: 1,
          pages: 1,
          keywords: "",
          multiplo: total % 8 === 0 ? 0 : 1,
          moment,
        });
      })
      .catch((error) => console.log(error));
  },
  add: async (req, res) => {
    if (req.query.quoters === "null") {
      return res.redirect("/quoters");
    }

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
      environment: environments,
      observations,
    } = req.body;

    if (typeof ids === "string") {
      ids = [ids];
      quantities = [quantities];
      supportOrientations = [supportOrientations];
      clothOrientations = [clothOrientations];
      commands = [commands];
      environments = [environments];
      observations = [observations];
    }

    try {
      let order = await db.Order.create({
        userId: req.session.userLogin.id,
        send: false,
        packaging: 200,
      });

      for (let i = 0; i < ids.length; i++) {
        await db.Quotation.update(
          {
            quantity: quantities[i],
            command: commands[i],
            supportOrientation: supportOrientations[i],
            clothOrientation: clothOrientations[i],
            environment: environments[i],
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
          send: true,
          orderNumber:
            req.session.userLogin.id +
            "-" +
            new Date().getTime().toString().slice(-8) +
            "-" +
            new Date().getFullYear().toString().slice(-2),
        },
        {
          where: {
            id: +req.query.order,
          },
        }
      );
      await db.Order.destroy({
        where: { send: 0 },
        force: true,
      });
      let order = await db.Order.findOne({
        where: {
          id: +req.query.order,
        },
        include: [
          {
            association: "user",
            attributes: ["name", "surname", "idLocal"],
          },
          {
            association: "quotations",
            include: { all: true },
          },
        ],
      });
      if (order) {
        let lastRow;
        const names = order.quotations.map((quotation) => quotation.reference);
        const references = [...new Set(names)];
        const amounts = order.quotations.map(
          (quotation) => quotation.amount * quotation.quantity
        );
        const total = amounts.reduce((acum, num) => acum + num);

        await db.Order.update(
          {
            total,
          },
          {
            where: {
              id: +req.query.order,
            },
          }
        );

        //planilla admin
        let wbAdmin = new xl.Workbook();
        let ws2 = wbAdmin.addWorksheet(
          "Orden: " + order.orderNumber + " - admin"
        );
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
          "Ambiente",
          "Referencia",
          "Observaciones",
          "Precio unitario",
          "Total",
        ];

        let style = wbAdmin.createStyle({
          font: {
            color: "#666666",
            size: 12,
          },
        });

        ws2
          .cell(1, 1, 1, 2, true)
          .string(`VENDEDOR:`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "right",
            },
          });

        ws2
          .cell(1, 3, 1, 3, true)
          .number(order.user.idLocal)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "left",
            },
          });

        ws2
          .cell(2, 1, 2, 2, true)
          .string(`PEDIDO PARA :`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "right",
            },
          });

        ws2
          .cell(2, 3, 2, 3, true)
          .string(`${references.join(", ")}`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "left",
            },
          });

        ws2
          .cell(1, 6, 1, 8, true)
          .string(`OBSERVACIONES PEDIDO:`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "right",
            },
          });

        ws2
          .cell(1, 9, 1, 9, true)
          .string(`${order.observations}`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "left",
            },
          });

        ws2
          .cell(2, 6, 2, 8, true)
          .string(`FECHA PEDIDO`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "right",
            },
          });

        ws2
          .cell(2, 9, 2, 9, true)
          .string(`${moment().format("DD/MM/YY")}`)
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
        ws2.column(2).setWidth(10); //sistema
        ws2.column(3).setWidth(10); //tela
        ws2.column(4).setWidth(10); //color
        ws2.column(5).setWidth(10); //ancho
        ws2.column(6).setWidth(10); //alto
        ws2.column(7).setWidth(10); //modelo
        ws2.column(8).setWidth(10); //cadena
        ws2.column(9).setWidth(10); //soporte
        ws2.column(10).setWidth(10); //comando
        ws2.column(11).setWidth(15); //o. soporte
        ws2.column(12).setWidth(15); //o. tela
        ws2.column(13).setWidth(20); //ambiente
        ws2.column(14).setWidth(15); //referencia
        ws2.column(15).setWidth(20); //observaciones
        ws2.column(16).setWidth(15); //p. unitario
        ws2.column(17).setWidth(10); //total

        titles.forEach((title, index) => {
          ws2
            .cell(3, index + 1)
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
          ws2.cell(index, 13).string(quotation.environment).style(style);
          ws2.cell(index, 14).string(quotation.reference).style(style);
          ws2.cell(index, 15).string(quotation.observations).style(style);
          ws2.cell(index, 16).number(quotation.amount).style(style);
          ws2
            .cell(index, 17)
            .number(quotation.amount * quotation.quantity)
            .style(style);
          lastRow = index + 1;
        });

        ws2
          .cell(lastRow, 16, lastRow, 16, true)
          .string(`EMBALAJE: `)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "right",
            },
          });
        ws2
          .cell(lastRow, 17, lastRow, 17, true)
          .number(order.packaging)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "right",
            },
          });

        ws2
          .cell(lastRow + 1, 16, lastRow + 1, 16, true)
          .string(`TOTAL:`)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "right",
            },
          });
        ws2
          .cell(lastRow + 1, 17, lastRow + 1, 17, true)
          .number(total + order.packaging)
          .style(style)
          .style({
            alignment: {
              vertical: "center",
              horizontal: "right",
            },
          });

        var fileAdmin = `${order.orderNumber}.xls`;
        var fileClient = `${order.orderNumber}.pdf`;

        await db.Order.update(
          {
            fileClient,
            fileAdmin,
          },
          {
            where: {
              id: +req.query.order,
            },
          }
        );

        wbAdmin.write(`src/downloads/${fileAdmin}`);

        //pdf vendedor

        const body = [
          [
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
            "Ambiente",
            "Referencia",
            "Observaciones",
            "Precio unitario",
            "Total",
          ],
        ];

        order.quotations.forEach((quotation) => {
          body.push([
            {
              text: quotation.quantity,
            },
            {
              text: quotation.system.name,
            },
            {
              text: quotation.cloth.name,
            },
            {
              text: quotation.color.name,
            },
            {
              text: quotation.clothWidth,
            },
            {
              text: quotation.heigth,
            },
            {
              text: quotation.pattern.name,
            },
            {
              text: quotation.chain.name,
            },
            {
              text: quotation.support.name,
            },
            {
              text: quotation.command,
            },
            {
              text: quotation.supportOrientation,
            },
            {
              text: quotation.clothOrientation,
            },
            {
              text: quotation.environment,
            },
            {
              text: quotation.reference,
            },
            {
              text: quotation.observations,
            },
            {
              text: quotation.amount,
              alignment : "right"
            },
            {
              text: quotation.amount * quotation.quantity,
              alignment : "right"
            },
          ]);
        });

        body.push([
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "Embalaje:",
            alignment : "right"
          },
          {
            text:  "200",
            alignment : "right"
          },
        ]);
        body.push([
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "",
          },
          {
            text: "Total:",
            alignment : "right"
          },
          {
            text:  total,
            alignment : "right"
          },
        ]);

        const docDefinition = {
          defaultStyle: {
            fontSize: 10,
          },
          styles: {
            header: {
              fontSize: 30,
              bold: true,
              alignment: 'center'
            },
            anotherStyle: {
              italics: true,
              alignment: 'right'
            }
          },
          header: {
            columns: [
              {
                image: path.resolve(__dirname, '..','assets','images','logo-blancomad2.jpg'),
                width: 100,
                alignment :'center',

              },
              {
                text : `Orden #${order.orderNumber}`, 
                alignment: 'right',
                fontSize: 20,
              },
            ],
            margin : [20,30]

          },
          footer: {
            columns: [
              `Observaciones: ${order.observations}`,
              { 
                text: `Fecha: ${moment().format("DD/MM/YY")}`, 
                alignment: 'right' 
              }
            ],
            margin : [30,30],
            fontSize: 16,
          },
          pageSize: "LEGAL",
          pageOrientation: "landscape",
          pageMargins: [10, 60, 10, 60],
          content: [
           
            {
              layout: "lightHorizontalLines", // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths:   [
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                ],
                body,

              },
              margin : [20,50]

            },
          ],
        };

        const options = {
          // ...
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(
          fs.createWriteStream(
            path.resolve(
              __dirname,
              "..",
              "downloads",
              `${order.orderNumber}.pdf`
            )
          )
        );
        pdfDoc.end();

        setTimeout(() => {
          let message2 = new Message({
            text: `Hola, ${req.session.userLogin.name}.\nSe adjunta copia del pedido generado en el sistema. Gracias por usar nuestra aplicación.`,
            from: "cotizadorblancomad@gmail.com",
            to: req.session.userLogin.email,
            cc: " ",
            subject: "Orden #" + order.orderNumber,
            attachment: [
               {
                path: path.resolve(
                  __dirname,
                  "..",
                  "downloads",
                  `${order.orderNumber}.pdf`
                ),
                type: "application/pdf",
                name: `${order.orderNumber}.pdf`,
              },
            ],
          });
          let message = new Message({
            text: `Se adjunta planilla de la orden #${order.orderNumber}.\nVendedor/a: ${req.session.userLogin.name}.`,
            from: "cotizadorblancomad@gmail.com",
            to: "cotizadorblancomad@gmail.com",
            cc: " ",
            subject: "Orden #" + order.orderNumber,
            attachment: [
              {
                path: path.resolve(
                  __dirname,
                  "..",
                  "downloads",
                  `${order.orderNumber}.pdf`
                ),
                type: "application/pdf",
                name: `${order.orderNumber}.pdf`,
              },
              {
                path: path.resolve(
                  __dirname,
                  "..",
                  "downloads",
                  `${order.orderNumber}.xls`
                ),
                type: "application/octet-stream",
                name: `${order.orderNumber}.xls`,
              },
            ],
          });

          client.send(message, (err, message) => {
            console.log(err || message);
          });

          client.send(message2, (err, message) => {
            console.log(err || message);
          });
          return res.redirect("/response/send-order");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  },
  createExcel: (req, res) => {},
  download: (req, res) => {
    const { file, orderNumber } = req.query;
    db.Order.findOne({
      where: { orderNumber },
    }).then((order) => {
      if (file === "client") {
        return res.download(
          path.join(__dirname, "..", "downloads", order.fileClient)
        );
      } else {
        return res.download(
          path.join(__dirname, "..", "downloads", order.fileAdmin)
        );
      }
    });
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
  filter: async (req, res) => {
    let { order, filter, keywords, active, pages } = req.query;
    let items = [];
    let users = [];
    let total = 0;

    try {
      users = await db.Quotation.findAll({
        attributes: ["userId"],
        include: [{ association: "user" }],
        group: ["userId"],
        having: "",
      });
      if (filter === "all" || !filter) {
        total = await db.Order.count();
        console.log("====================================");
        console.log(total);
        console.log("====================================");

        items = await db.Order.findAll({
          include: [
            {
              association: "quotations",
              where: {
                reference: {
                  [Op.substring]: keywords,
                },
              },
              include: [{ all: true }],
            },
            { association: "user" },
          ],
          order: [order || "id"],
          limit: 8,
          offset: active && +active * 8 - 8,
          //include: { all: true },
        });
      } else {
        total = await db.Order.count({
          where: {
            userId: +filter,
          },
        });
        items = await db.Order.findAll({
          where: {
            userId: +filter,
          },
          include: [
            {
              association: "quotations",
              where: {
                reference: {
                  [Op.substring]: keywords,
                },
              },
              include: [{ all: true }],
            },
            { association: "user" },
          ],
          order: [order || "id"],
          limit: 8,
          offset: active && +active * 8 - 8,
          //include: { all: true },
        });
      }
      return res.render("orders", {
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
  },
  /* apis */
};
