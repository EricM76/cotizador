const db = require('../database/models');

module.exports = async (width, heigth, amount) => {
    
    try {

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
 
         /* obtengo el precio del riel panel (id 336 system) */
 
         let priceRail = await db.System.findByPk(336);
 
         console.log('====================================');
         console.log('PRECIO DEL RIEL', priceRail.price);
         console.log('====================================');
 
         /* sumo al monto el valor del riel. El mismo es el resultado del ancho obtenido x el valor del riel */
         amount = amount + (width * priceRail.price);
         console.log('====================================');
         console.log('ANCHO FINAL', width);
         console.log('PRECIO RIELES (ANCHO x PRECIO DEL RIEL)', width * priceRail.price);
         console.log('PRECIO FINAL (PRECIO + PRECIO RIELES)', amount)
         console.log('====================================');

         return amount

    } catch (error) {
        console.log(error)
    }

}