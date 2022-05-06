const path = require("path");

const XLSX = require("xlsx");
const createHTML = require('create-html');
const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const { JSDOM } = require("jsdom");

const moment = require("moment");
const { SMTPClient, Message } = require("emailjs");
const { Op } = require("sequelize");

const fonts = require("../fonts/Roboto");
const PdfPrinter = require("pdfmake");
const printer = new PdfPrinter(fonts);
const fs = require("fs");

const db = require("../database/models");
const { quoterUpdate } = require('./quoterController')

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
          toThousand: (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        });
      })
      .catch((error) => console.log(error));
  },
  add: async (req, res) => {
    if (req.query.quoters === "null") {
      return res.redirect("/quoters");
    }

    const quoters = JSON.parse(req.query.quoters).map((quoter) => +quoter);

    const items = await db.Quotation.findAll({
      where: {
        id: {
          [Op.in]: quoters,
        },
      },
      include: [{ all: true }],
    });

    const itemsUpdated = [];

    items.forEach(async (item) => {
      const { systemId, clothId, colorId, supportId, patternId, chainId, clothWidth, heigth } = item;
      let priceUpdated = await quoterUpdate(req,systemId, clothId, colorId, supportId, patternId, chainId, clothWidth, heigth);

      item.amount = +priceUpdated.toFixed(0);

      itemsUpdated.push(item);

    });

    setTimeout(() => {
      req.session.itemsUpdated = itemsUpdated;
      return res.render("orderAdd", {
        items: itemsUpdated,
      })
    }, 2000);



  },
  store: async (req, res) => {
    let {
      id: ids,
      quantity: quantities,
      supportOrientation: supportOrientations,
      clothOrientation: clothOrientations,
      command: commands,
      environment: environments,
      amount: amounts,
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
      amounts = [amounts]
    }

    req.session.idsQuotations = ids;

    console.log('====================================');
    console.log(clothOrientations);
    console.log('====================================');

    try {
      let order = await db.Order.create({
        userId: req.session.userLogin.id,
        send: false,
        packaging: fs.readFileSync(
          path.resolve(__dirname, "..", "data", "packaging.json")
        ),
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
            //amount: amounts && amounts[i]
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

    let accessories = await db.System.findAll({
      where : {
        accessory : true,
        visible : true
      }
    })

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
          accessories,
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
  addAccessories : async (req,res) => {

      const {accessories, order} = req.body;
      console.log('====================================');
      console.log(req.body);
      console.log('====================================');

        try {
          accessories.forEach(async ({id,price}) => {

            try {
              let quotation = await db.Quotation.create({
                clothWidth: 0,
                heigth: 0,
                amount: +price,
                date: new Date(),
                reference : req.session.userLogin.name,
                systemId: +id,
                clothId: 626,
                colorId: 17,
                supportId: 18,
                patternId: 6,
                chainId: 6,
                userId: req.session.userLogin.id,
              })
              await db.OrderQuotation.create({
                quotationId: quotation.id,
                orderId: +order,
              });
            } catch (error) {
              console.log('====================================');
              console.log(error);
              console.log('====================================');
            }
        })

          return res.status(200).json({
            ok : true,
            data : req.body
          })

        }
        catch (error) {
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
    
    
  },
  send: async (req, res) => {

    let {
      name,
      price,
      quantity,
      id
    } = req.body;

    id = typeof id === "string" ? id.split() : id;
    name = typeof name === "string" ? name.split() : name;
    price = typeof price === "string" ? price.split() : price;
    quantity = typeof quantity === "string" ? quantity.split() : quantity;

    const accessories = [];
    if(name){
      for (let i = 0; i < name.length; i++) {
      
        accessories.push({
          id : id[i],
          quantity : quantity[i] > 5 ? 5 : quantity[i],
          name : name[i],
          price : price[i]
        })
        
      }
    }
  
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
          ticket: req.file ? req.file.filename : 'no-transfer.png'
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

      for (let i = 0; i < req.session.idsQuotations.length; i++) {
        await db.Quotation.update(
          {
            quantity: 1,
          },
          {
            where: {
              id: +req.session.idsQuotations[i],
            },
          }
        );
        }

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
        const names = order.quotations.map((quotation) => quotation.reference);
        const references = [...new Set(names)];
        const amounts = order.quotations.map(
          (quotation) => quotation.amount * quotation.quantity
        );

        let priceAccessory = 0;

        if(accessories.length > 0){
          const prices = accessories.map(
            (accessory) => +accessory.price * +accessory.quantity 
          )
          priceAccessory = prices.reduce((acum, num) => acum + num)
        }
     
        const total = amounts.reduce((acum, num) => acum + num) + priceAccessory;

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

        /* PLANILLA ADMINISTRADOR */
        let table = `
        <table class="table table-striped">
        <thead>
        <tr>
        <th scope="col">Orden:</th>
        <th scope="col">${order.orderNumber}</th>
        </tr>
        <tr>
        <th scope="col">Vendedor:</th>
        <th scope="col">${order.user.idLocal}</th>
        </tr>
        <tr>
        <th scope="col">Pedido para:</th>
        <th scope="col">${references.join(' - ')}
        </th>
        </tr>
        <tr>
        <th>Fecha: </th>
        <th>${moment().format("DD/MM/YY")}</th>
        </tr>
        <tr>
        <th scope="col">Observaciones:</th>
        <th scope="col">${order.observations}
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
        order.quotations.forEach((item) => {
          table += `
            <tr>
            <th scope="row">
              ${item.quantity}
            </th>
            <td>
              ${item.systemId}
            </td>
            <td>
              ${item.clothId}
            </td>
            <td>
              ${item.colorId}
            </td>
            <td>
                ${item.clothWidth}
              </td>
              <td>
                ${item.heigth}
              </td>
              <td>
                ${item.patternId}
              </td>
              <td>
                ${item.chainId}
              </td>
              <td>
                ${item.supportId}
              </td>
              <td>
                ${item.command}
              </td>
              <td>
                ${item.supportOrientation}
              </td>
              <td>
                ${item.clothOrientation}
              </td>
              <td>
                ${item.observations}
              </td>
              <td>
                ${item.environment}
              </td>
              <td>
                ${item.reference}
              </td>
              <td style="text-align:right;">
                    ${item.amount}
              </td>
              <td style="text-align:right;">
                    ${item.amount * item.quantity}
              </td>
          </tr>
          `
        });
        accessories.forEach(({id,quantity,name,price}) => {
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
                    ${req.session.packaging}
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
                    ${total + req.session.packaging}
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

        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'table.html'), html, function (err) {
          if (err) console.log(err)
        })

        const html_str = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'table.html'), "utf8");
        const doc = new JSDOM(html_str).window.document.querySelector("table");
        const workbook = XLSX.utils.table_to_book(doc);

        XLSX.writeFile(workbook, path.resolve(__dirname, '..', 'downloads', `${order.orderNumber}.xls`), {
          bookType: "xlml",
          sheet: 0
        });



        /* PDF VENDEDOR/ADMIN/CONTROL */
        let docDefinition;
        if (req.session.userLogin.rolName !== "medidor") {

          const body = [
            ["Cant", "Sistema", "Tela", "Color", "Ancho", "Alto", "Modelo", "Cadena", "Soporte", "Comando", "Orien. Soporte", "Orien. Tela", "Ambiente", "Referencia", "Observaciones", "Precio unitario", "Total",],
          ];

          order.quotations.forEach((quotation) => {
            body.push([{ text: quotation.quantity }, { text: quotation.system.name }, { text: quotation.cloth.name }, { text: quotation.color.name }, { text: quotation.clothWidth }, { text: quotation.heigth }, { text: quotation.pattern.name }, { text: quotation.chain.name }, { text: quotation.support.name }, { text: quotation.command }, { text: quotation.supportOrientation }, { text: quotation.clothOrientation }, { text: quotation.environment }, { text: quotation.reference }, { text: quotation.observations }, { text: quotation.amount, alignment: "right" }, { text: quotation.amount * quotation.quantity, alignment: "right" }]);
          });

          accessories.forEach(({quantity, name, price}) => {
            body.push([{ text: quantity }, { text: name }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: +price, alignment: "right" }, { text: +price * +quantity, alignment: "right" }]);
          });

          body.push([
            { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" },
            {
              text: "Embalaje:",
              alignment: "right",
            },
            {
              text: req.session.packaging,
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
              text: total + req.session.packaging,
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
                  text: `Orden #${order.orderNumber}`,
                  alignment: "right",
                  fontSize: 18,
                },
              ],
              margin: [20, 30],
            },
            footer: {
              columns: [
                `Observaciones: ${order.observations}`,
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
    
          accessories.forEach(({quantity, name, price}) => {
            body.push([{ text: quantity }, { text: name }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "", alignment: "right" }, { text: "" , alignment: "right" }]);
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
              `${order.orderNumber}.pdf`
            )
          )
        );
        pdfDoc.end();

        let fileAdmin = `${order.orderNumber}.xls`;
        let fileClient = `${order.orderNumber}.pdf`;

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

        setTimeout(() => {
          let message;
          let message2;
             message2 = new Message({
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
                {
                  path: path.resolve(
                    __dirname,
                    "..",
                    "downloads",
                    order.ticket || ''
                  ),
                  type: "image",
                  name: order.ticket,
                }
              ],
            });
            message = new Message({
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
                {
                  path: path.resolve(
                    __dirname,
                    "..",
                    "downloads",
                    order.ticket || ''
                  ),
                  type: "image",
                  name: order.ticket,
                }
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
  createExcel: (req, res) => { },
  download: (req, res) => {
    const { file, orderNumber } = req.query;
    db.Order.findOne({
      where: { orderNumber },
    }).then((order) => {

      switch (file) {
        case "client":
          return res.download(
            path.join(__dirname, "..", "downloads", order.fileClient)
          );
        case "admin":
          return res.download(
            path.join(__dirname, "..", "downloads", order.fileAdmin)
          );
        case "ticket":
          return res.download(
            path.join(__dirname, "..", "downloads", order.ticket)
          );
        default:
          break;
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
        toThousand: (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      });
    } catch (error) {
      console.log(error);
    }
  },
  /* apis */
};
