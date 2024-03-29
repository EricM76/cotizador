const path = require('path');
const xl = require("excel4node");
const html_to_pdf = require('html-pdf-node');
const moment = require("moment");
const { SMTPClient, Message } = require("emailjs");
const { Op } = require("sequelize");

const db = require("../database/models");

const client = new SMTPClient({
  user: "cotizadorblancomad@gmail.com",
  password: "cotizador2022",
  host: "smtp.gmail.com",
  ssl: true,
  timeout : 10000
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
      include : [
        {
          association : 'quotations',
          include : {all:true}
        },
        {association : 'user'}
      ],
      order : [['createdAt','DESC']]
    })
    let total = db.Order.count()
    Promise.all(([users,items, total]))
    .then(([users,items, total]) => {
    
      return res.render("orders",{
        items,
        users,
        total,
        active: 1,
        pages: 1,
        keywords: "",
        multiplo: total % 8 === 0 ? 0 : 1,
        moment,
      });
    }).catch(error => console.log(error))
  },
  add: async (req, res) => {

    if (req.query.quoters === 'null') {
      return res.redirect('/quoters')
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
      environment :environments,
      observations,
    } = req.body;

    if (typeof ids === "string") {
      ids = [ids];
      quantities = [quantities];
      supportOrientations = [supportOrientations];
      clothOrientations = [clothOrientations];
      commands = [commands];
      environments = [environments]
      observations = [observations];
    }

    try {
      let order = await db.Order.create({
        userId: req.session.userLogin.id,
        send : false,
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
          send : true,
          orderNumber : req.session.userLogin.id +'-'+ (new Date().getTime()).toString().slice(-8) + '-' + new Date().getFullYear().toString().slice(-2)
        },
        {
          where: {
            id: +req.query.order,
          },
        }
      );
      await db.Order.destroy({
        where : {send:0},
        force : true,
      })
      let order = await db.Order.findOne({
        where: {
          id: +req.query.order,
        },
        include: [
          {
            association: "user",
            attributes: ["name", "surname","idLocal"],
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
        var fileClient=`${order.orderNumber}.pdf`

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

        //  <tr>

      let rows = '<tbody>\n'
      order.quotations.forEach((quotation, index) => {
        rows += `
        <tr>
        <th scope="row">${quotation.quantity}</th>
        <td>${quotation.system.name}</td>
        <td>${quotation.cloth.name}</td>
        <td>${quotation.color.name}</td>
        <td>${quotation.clothWidth}</td>
        <td>${quotation.heigth}</td>
        <td>${quotation.pattern.name}</td>
        <td>${quotation.chain.name}</td>
        <td>${quotation.support.name}</td>
        <td>${quotation.command}</td>
        <td>${quotation.supportOrientation}</td>
        <td>${quotation.clothOrientation}</td>
        <td>${quotation.environment}</td>
        <td>${quotation.reference}</td>
        <td>${quotation.observations}</td>
        <td style="text-align: right;">${quotation.amount}</td>
        <td style="text-align: right;">${quotation.amount * quotation.quantity}</td>
      </tr>
        `
      })
  
        let file = {content :  `

<body>
    <div class="container">
        <div class="row">

            <h2>Pedido #${order.orderNumber}</h2>
            <div class="card">
                <div class="card-header d-flex">
                    <h4>Vendedor: ${order.user.name} ${order.user.surname}</h4>
                    <h4>Pedido para: ${references}</h4>
                </div>
                <div class="card-body">
                <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Cant.</th>
                    <th scope="col">Sistema</th>
                    <th scope="col">Tela</th>
                    <th scope="col">Color</th>
                    <th scope="col">Ancho</th>
                    <th scope="col">Alto</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">Cadena</th>
                    <th scope="col">Soporte</th>
                    <th scope="col">Comando</th>
                    <th scope="col">Orien. Soporte</th>
                    <th scope="col">Orien. Tela</th>
                    <th scope="col">Ambiente</th>
                    <th scope="col">Referencia</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col">Precio unitario</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                ${rows}
                <tr>
                <td colspan="16" style="text-align: right;">Embalaje: </td>
                <td style="text-align: right;"><span>200</span></td>
                </tr>
                <tr>
                <td colspan="16" style="text-align: right;">Total: </td>
                <td style="text-align: right;"><span>${total}</span></td>
                </tr>
                </tbody>
              </table>
                </div>
                <div class="card-footer">
                    <p>Fecha: ${moment().format("DD/MM/YY")}</p>
                    <hr>
                    <p>Observaciones: ${order.observations}</p>
                </div>
            </div>
        </div>
    </div>
    
</body>
        `
  }
        const options = {
          format : 'A4',
          landscape : true,
          path : path.join(__dirname,'..','downloads', `${order.orderNumber}.pdf`)
        }

        try {
          let pdfBuffer = await html_to_pdf.generatePdf(file, options)
          console.log("PDF Buffer:-", pdfBuffer);
        } catch (error) {
          console.log(error)
        }

          let message = new Message({
            text: `Hola, ${req.session.userLogin.name}.\nSe adjunta copia del pedido generado en el sistema. Gracias por usar nuestra aplicación.`,
            from: "cotizadorblancomad@gmail.com",
            to: req.session.userLogin.email,
            cc: " ",
            subject: "Orden #" + order.orderNumber,
            attachment: [
              {
                path: `src/downloads/${order.orderNumber}.pdf`,
                type: "application/pdf",
                name: `${order.orderNumber}.pdf`,
              },
            ],
          });
          let message2 = new Message({
            text: `Se adjunta planilla de la orden #${order.orderNumber}.\nVendedor/a: ${req.session.userLogin.name}.`,
            from: "cotizadorblancomad@gmail.com",
            to: "cotizadorblancomad@gmail.com",
            cc: " ",
            subject: "Orden #" + order.orderNumber,
            attachment: [
              {
                path: `src/downloads/${order.orderNumber}.pdf`,
                type: "application/pdf",
                name: `${order.orderNumber}.pdf`,
              },
              {
                path: `src/downloads/${order.orderNumber}.xls`,
                type: "application/octet-stream",
                name: `${order.orderNumber}.xls`,
              },
            ],
          });

          try {
            await client.send(message, (err, message) => {
              console.log(err || message);
            });
  
            await client.send(message2, (err, message) => {
              console.log(err || message);
            });
          } catch (error) {
            console.log(error)
          }
          return res.redirect("/response/send-order");
      }
    } catch (error) {
      console.log(error);
    }
  },
  createExcel: (req, res) => { },
  download: (req, res) => {
    
    const {file, orderNumber} = req.query;
    db.Order.findOne({
      where : {orderNumber}
    }).then(order => {
      if(file === 'client'){
        return res.download(path.join(__dirname, "..", "downloads", order.fileClient));
      }else{
        return res.download(path.join(__dirname, "..", "downloads", order.fileAdmin)); 
      }
    })
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
          total = await db.Order.count({
            include :[
              {
                association : 'quotations',
                where: {
                  reference: {
                    [Op.substring]: keywords,
                  },
                },
                include : [{all:true}]
              },
             {association : 'user'} 
            ],
          
          });
          items = await db.Order.findAll({
            include :[
              {
                association : 'quotations',
                where: {
                  reference: {
                    [Op.substring]: keywords,
                  },
                },
                include : [{all:true}]
              },
              {association : 'user'} 
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
            include :[
              {
                association : 'quotations',
                where: {
                  reference: {
                    [Op.substring]: keywords,
                  },
                },
                include : [{all:true}]
              },
              {association : 'user'} 
            ],
          });
          items = await db.Order.findAll({
            where: {
              userId: +filter,
            },
            include :[
              {
                association : 'quotations',
                where: {
                  reference: {
                    [Op.substring]: keywords,
                  },
                },
                include : [{all:true}]
              },
              {association : 'user'} 
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
