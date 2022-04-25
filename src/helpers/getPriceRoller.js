const db = require('../database/models');
const { sequelize } = require("../database/models");

module.exports = async (width, heigth, amount, cloth, pattern, support, chain) => {

    try {
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
   
           /* 
           ======================================================
           SI LA TELA ES ECLIPSE SE LE SUMA EL VALOR DE LA CENEFA 
           ======================================================
           */
   
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
   
             let priceCenefa = await db.System.findOne({
               where: {
                 id: 335, //eclipse cenefa
               },
             })
   
             console.log('====================================');
             console.log('PRECIO', amount);
             console.log('ANCHO CENEFA', width);
             console.log('PRECIO CENEFA', priceCenefa.price);
             console.log('====================================');
             amount = width < 1 ? amount + priceCenefa.price : amount + (width * priceCenefa.price)
           }
   
           return amount;

    } catch (error) {

        console.log(error);

    }
     

}