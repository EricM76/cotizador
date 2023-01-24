const db = require("../database/models");

const path = require("path");

const XLSX = require("xlsx");
const createHTML = require('create-html');
const { JSDOM } = require("jsdom");

const moment = require("moment");
const { Op } = require("sequelize");

const fonts = require("../fonts/Roboto");
const PdfPrinter = require("pdfmake");
const printer = new PdfPrinter(fonts);
const fs = require("fs");

const { SMTPClient, Message } = require("emailjs");

/* sendInBlue */
var SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.EMAIL_SEND_BLUE_APIKEY;

const axios = require("axios").default;

const client = new SMTPClient({
  user: "cotizadorblancomad@gmail.com",
  password: process.env.EMAIL_SEND_BLUE_SMTPKEY,
  host: "smtp-relay.sendinblue.com",
  ssl: true,
  timeout: 10000,
});


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
      visible,
      limit,
      salePrice
    } = req.body;

    try {
      const system = await db.System.create(
        {
          name: name.trim(),
          price,
          idLocal,
          salePrice,
          limit,
          visible: visible ? true : false,
          accessory: true
        },
        {
          where: { id: req.params.id },
        }
      );
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
      limit,
      salePrice,
      accessory,
    } = req.body;

    try {
      await db.System.update(
        {
          name: name.trim(),
          price,
          idLocal,
          limit,
          salePrice,
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
  buy: async (req, res) => {
    let packaging = await db.Package.findByPk(1)

    db.System.findAll({
      where: {
        visible: true,
        accessory: true,
      },
      order : [['name']]
    }).then(accessories => {
      return res.render("accessoriesBuy", {
        accessories,
        user: req.session.userLogin,
        packaging: packaging.price,
        toThousand: (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      })
    }).catch(error => console.log(error))

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
      return res.status(200).json({
        ok: true,
      });
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
  sendBuy: async (req, res) => {

   /*  const packaging = +fs.readFileSync(
      path.resolve(__dirname, "..", "data", "packaging.json")
    ); */

    let packaging = await db.Package.findByPk(1)

    const { quantities, names, prices, ids, observations, reference, limits} = req.body;
    const accessories = [];

    for (let i = 0; i < quantities.length; i++) {

      if (quantities[i] !== '' && quantities[i] !== '0' && quantities[i] <= limits[i]) {
        accessories.push({
          id: +ids[i],
          quantity: +quantities[i],
          name: names[i],
          price: +prices[i],
          subtotal: +prices[i] * +quantities[i]
        })
      }
    }
    const subtotales = accessories.map(accessory => accessory.subtotal);
    const total = subtotales.reduce((acum, sum) => acum + sum);

    const orderNumber =
      req.session.userLogin.id +
      "-" +
      new Date().getTime().toString().slice(-8) +
      "-" +
      new Date().getFullYear().toString().slice(-2)

    const ticket = req.file ? req.file.filename : 'no-transfer.png';

    /* PLANILLA ADMINISTRADOR */
    let table = `
     <table class="table table-striped">
     <thead>
     <tr>
     <th scope="col">Orden:</th>
     <th scope="col">${orderNumber}</th>
     </tr>
     <tr>
     <th scope="col">Vendedor:</th>
     <th scope="col">${req.session.userLogin.idLocal}</th>
     </tr>
     <tr>
     <th scope="col">Pedido para:</th>
     <th scope="col">${reference}
     </th>
     </tr>
     <tr>
     <th>Fecha: </th>
     <th>${moment().format("DD/MM/YY")}</th>
     </tr>
     <tr>
     <th scope="col">Observaciones:</th>
     <th scope="col">${observations}
     </th>
     </tr>
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
         <th scope="col">Obs.</th>
         <th scope="col">Ambiente</th>
         <th scope="col">Referencia</th>
         <th scope="col">Precio unitario</th>
         <th scope="col">Total</th>
       </tr>
     </thead>
     <tbody>
     `

    accessories.forEach(({ id, quantity, name, price }) => {
      table += `
         <tr>
         <th scope="row">
           ${quantity}
         </th>
         <td>
           ${id}
         </td>
         <td>
          626
         </td>
         <td>
          17
         </td>
         <td>
           0
         </td>
         <td>
           0
         </td>
         <td>
           6
         </td>
         <td>
           6
         </td>
         <td>
           18
         </td>
         <td>
           no aplica
         </td>
         <td>
          no aplica
         </td>
         <td>
           no aplica
         </td>
         <td>
           no aplica
         </td>
         <td>
           no aplica
         </td>
         <td>
           no aplica
         </td>
         <td style="text-align:right;">
               ${price}
         </td>
         <td style="text-align:right;">
               ${+price * +quantity}
         </td>
     </tr>
       `
    });
    table += `
             <tr>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td></td>
             <td style="text-align:right;">
                 <b>EMBALAJE:</b> 
             </td>
             <td style="text-align:right;">
                 ${packaging.price}
             </td>
           </tr>
           <tr>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
             <td style="text-align:right;">
                 <b>TOTAL:</b> 
             </td>
             <td style="text-align:right;">
                 ${total + packaging.price}
             </td>
           </tr>
       </tbody>
     </table>
     `


    const html = createHTML({
      title: 'Planilla',
      lang: 'es',
      body: table,
    })

    fs.writeFileSync(path.resolve(__dirname, '..', 'data', req.session.userLogin.id + '.html'), html, function (err) {
      if (err) console.log(err)
    })

    const html_str = fs.readFileSync(path.resolve(__dirname, '..', 'data', req.session.userLogin.id + '.html'), "utf8");
    const doc = new JSDOM(html_str).window.document.querySelector("table");
    const workbook = XLSX.utils.table_to_book(doc);

    XLSX.writeFile(workbook, path.resolve(__dirname, '..', 'downloads', `${orderNumber}.xls`), {
      bookType: "xlml",
      sheet: 0
    });

     /* guardo en public */
     XLSX.writeFile(workbook, path.resolve(__dirname,'..','..', 'public','emails',`${orderNumber}.xls`), {
      bookType: "xlml",
      sheet: 0
    });



    /* PDF VENDEDOR/ADMIN/CONTROL */
    let docDefinition;
    if (req.session.userLogin.rolName !== "medidor") {

      const body = [
        ["Cant", "Sistema", "Tela", "Color", "Ancho", "Alto", "Modelo", "Cadena", "Soporte", "Comando", "Orien. Soporte", "Orien. Tela", "Ambiente", "Referencia", "Observaciones", "Precio unitario", "Total",],
      ];

      accessories.forEach(({ quantity, name, price }) => {
        body.push([{ text: quantity }, { text: name }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: +price, alignment: "right" }, { text: +price * +quantity, alignment: "right" }]);
      });

      body.push([
        { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" },
        {
          text: "Embalaje:",
          alignment: "right",
        },
        {
          text: packaging.price,
          alignment: "right",
        },
      ]);
      body.push([
        { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" },
        {
          text: "Total:",
          alignment: "right",
        },
        {
          text: total + packaging.price,
          alignment: "right",
        },
      ]);

      docDefinition = {
        defaultStyle: {
          fontSize: 10,
        },
        styles: {
          header: {
            fontSize: 30,
            bold: true,
            alignment: "center",
          },
          anotherStyle: {
            italics: true,
            alignment: "right",
          },
        },
        header: {
          columns: [
            {
              image: path.resolve(
                __dirname,
                "..",
                "assets",
                "images",
                "logo-blancomad2.jpg"
              ),
              width: 100,
              alignment: "center",
            },
            {
              text: `Orden #${orderNumber}`,
              alignment: "right",
              fontSize: 18,
            },
          ],
          margin: [20, 30],
        },
        footer: {
          columns: [
            `Observaciones: ${observations}`,
            {
              text: `Fecha: ${moment().format("DD/MM/YY")}`,
              alignment: "right",
            },
          ],
          margin: [30, 30],
          fontSize: 16,
        },
        pageSize: "LEGAL",
        pageOrientation: "landscape",
        pageMargins: [10, 60, 10, 60],
        content: [
          {
            layout: "lightHorizontalLines", // optional
            table: {
              headerRows: 1,
              widths: [
                "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"
              ],
              body,
            },
            margin: [20, 50],
          },
        ],
      };

    } else {

      /* PDF MEDIDOR */

      const body = [
        ["Cant", "Sistema", "Tela", "Color", "Ancho", "Alto", "Modelo", "Cadena", "Soporte", "Comando", "Orien. Soporte", "Orien. Tela", "Ambiente", "Referencia", "Observaciones", "Precio unitario", "Total",],
      ];

      accessories.forEach(({ quantity, name, price }) => {
        body.push([{ text: quantity }, { text: name }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "", alignment: "right" }, { text: "", alignment: "right" }]);
      });

      body.push([
        { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" },
        {
          text: "Embalaje:",
          alignment: "right",
        },
        {
          text: "",
          alignment: "right",
        },
      ]);
      body.push([
        { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" },
        {
          text: "Total:",
          alignment: "right",
        },
        {
          text: "",
          alignment: "right",
        },
      ]);

      docDefinition = {
        defaultStyle: {
          fontSize: 10,
        },
        styles: {
          header: {
            fontSize: 30,
            bold: true,
            alignment: "center",
          },
          anotherStyle: {
            italics: true,
            alignment: "right",
          },
        },
        header: {
          columns: [
            {
              image: path.resolve(
                __dirname,
                "..",
                "assets",
                "images",
                "logo-blancomad2.jpg"
              ),
              width: 100,
              alignment: "center",
            },
            {
              text: `Orden #${orderNumber}`,
              alignment: "right",
              fontSize: 18,
            },
          ],
          margin: [20, 30],
        },
        footer: {
          columns: [
            `Observaciones: ${observations}`,
            {
              text: `Fecha: ${moment().format("DD/MM/YY")}`,
              alignment: "right",
            },
          ],
          margin: [30, 30],
          fontSize: 16,
        },
        pageSize: "LEGAL",
        pageOrientation: "landscape",
        pageMargins: [10, 60, 10, 60],
        content: [
          {
            layout: "lightHorizontalLines", // optional
            table: {
              headerRows: 1,
              widths: [
                "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"
              ],
              body,
            },
            margin: [20, 50],
          },
        ],
      };
    }

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
          `${orderNumber}.pdf`
        )
      )
    );

     /* guardo en públic */
     pdfDoc.pipe(
      fs.createWriteStream(
        path.resolve(
          __dirname,
          "..",
          "..",
          "public",
          "emails",
          `${orderNumber}.pdf`
        )
      )
    );
    pdfDoc.end();

    let fileAdmin = `${orderNumber}.xls`;
    let fileClient = `${orderNumber}.pdf`;

    await db.Order.create({
      userId: req.session.userLogin.id,
      observations,
      packaging: packaging.price,
      orderNumber,
      ticket,
      fileClient,
      fileAdmin,
      total 
    });

      /* duplico el archivo de ticket */
      if(fs.existsSync(path.resolve(__dirname, "..", "downloads", ticket))){
        fs.copyFileSync(path.resolve(__dirname, "..", "downloads", ticket), path.resolve(__dirname, "..","..","public","tickets", ticket));
      }

/*     setTimeout(async () => {
      let message;
      let message2;
      message2 = new Message({
        text: `Hola, ${req.session.userLogin.name}.\nSe adjunta copia del pedido generado en el sistema. Gracias por usar nuestra aplicación.`,
        from: "cotizadorblancomad@gmail.com",
        to: req.session.userLogin.email,
        cc: " ",
        subject: "Orden #" + orderNumber,
        attachment: [
          {
            path: path.resolve(
              __dirname,
              "..",
              "downloads",
              `${orderNumber}.pdf`
            ),
            type: "application/pdf",
            name: `${orderNumber}.pdf`,
          },
          {
            path: path.resolve(
              __dirname,
              "..",
              "downloads",
              ticket || ''
            ),
            type: "image",
            name: ticket,
          }
        ],
      });
      message = new Message({
        text: `Se adjunta planilla de la orden #${orderNumber}.\nVendedor/a: ${req.session.userLogin.name}.`,
        from: "cotizadorblancomad@gmail.com",
        to: "cotizadorblancomad@gmail.com",
        cc: " ",
        subject: "Orden #" + orderNumber,
        attachment: [
          {
            path: path.resolve(
              __dirname,
              "..",
              "downloads",
              `${orderNumber}.pdf`
            ),
            type: "application/pdf",
            name: `${orderNumber}.pdf`,
          },
          {
            path: path.resolve(
              __dirname,
              "..",
              "downloads",
              `${orderNumber}.xls`
            ),
            type: "application/octet-stream",
            name: `${orderNumber}.xls`,
          },
          {
            path: path.resolve(
              __dirname,
              "..",
              "downloads",
              ticket || ''
            ),
            type: "image",
            name: ticket,
          }
        ],
      });

      client.send(message, (err, message) => {
        console.log(err || message);
      });

      client.send(message2, (err, message) => {
        console.log(err || message);
      });
      await db.Order.update(
        {
          send: true,
        },
        {
          where : {
            orderNumber
          }
        }
      )
      return res.redirect("/response/send-order");
    }, 2000); */


    const optionsAxios = {
      method: 'POST',
      url: 'https://api.sendinblue.com/v3/smtp/email',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.EMAIL_SEND_BLUE_APIKEY
      },
      data: {
        sender: { 'email': 'info@blancomad.com', 'name': 'Cotizador Blancomad' },
        subject: '{{params.userName}} {{params.userSurname}}. Orden #{{params.order}}',
        params: {
          userName: req.session.userLogin.name,
          userSurname : req.session.userLogin.surname,
          userEmail: req.session.userLogin.email,
          order: orderNumber
        },
            to: [{ email: req.session.userLogin.email }],
            attachment: [
              {
                url: req.protocol + '://' + req.get('host') + '/emails/' + orderNumber + '.pdf',
                name: orderNumber + '.pdf'
              },
              {
                url: req.protocol + '://' + req.get('host') + '/tickets/' + ticket,
                name: ticket
              }
            ],
            htmlContent: '<html><body><h1>Cotizador Blancomad</h1><p>Hola, {{params.userName}}.</p><p>Se adjunta copia del pedido generado en el sistema. Gracias por usar nuestra aplicación. </p></body></html>',
      },
    };

    const optionsAxios2 = {
      method: 'POST',
      url: 'https://api.sendinblue.com/v3/smtp/email',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.EMAIL_SEND_BLUE_APIKEY
      },
      data: {
        sender: { 'email': 'cotizadorblancomad@gmail.com', 'name': 'Cotizador Blancomad' },
        subject: 'Orden #{{params.order}}',
        params: {
          userName: req.session.userLogin.name,
          userEmail: req.session.userLogin.email,
          order: orderNumber
        },
        to: [{ email: 'info@blancomad.com' },{email:'menaeric@hotmail.com'}],
        attachment: [
          {
            url: req.protocol + '://' + req.get('host') + '/emails/' + orderNumber + '.pdf',
            name: orderNumber + '.pdf'
          },
          {
            url: req.protocol + '://' + req.get('host') + '/emails/' + orderNumber + '.xls',
            name: orderNumber + '.xls'
          },
          {
            url: req.protocol + '://' + req.get('host') + '/tickets/' + ticket,
            name: ticket
          }
        ],
        htmlContent: '<html><body><h1>Cotizador Blancomad</h1><p>Se adjunta planilla de la orden #{{params.order}}.\nVendedor/a: {{params.userName}}. </p></body></html>',
      },
    };

      axios.request(optionsAxios)
        .then(sendClient => {
          axios.request(optionsAxios2)
            .then(async(sendAdmin) => {
              console.log(sendClient.data);
              console.log(sendAdmin.data);
              await db.Order.update(
                {
                  send : true
                },
                {
                  where: {
                    orderNumber,
                  },
                }
              );
              return res.redirect("/response/send-order");
            })
        })
        .catch(error => console.log(error))
  }

};
