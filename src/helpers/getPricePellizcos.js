const db = require('../database/models');
const getRoundedArea = require('./getRoundedArea');

module.exports = async (system, width, heigth, amount) => {

  try {

    /* defino el alto mínimo*/
    heigth = +heigth < 100 ? 100 : +heigth;
    console.log('====================================');
    console.log('ALTO MINIMO', heigth);
    console.log('====================================');

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

    /* si es pellizco simple o triple el ancho se multiplica por 3 y si es pellizco doble se multplica por 2 para obtener el ancho extendido */
    widthExt = +system === 129 || +system === 116 ? (width * 3) : (width * 2);

    console.log('====================================');
    console.log('ANCHO MULTIPLICADO SEGÚN SISTEMA', width);
    console.log('====================================');

    /* calculo la superficie con el ancho extendido */
    let area = widthExt * (heigth / 100);
    console.log('====================================');
    console.log('SUPERFICIE TOTAL', area);
    console.log('====================================');

    /* si la superficie es menor a dos, lo fijo en dos o queda se redondea el decimal en cinco o se suma un entero */
    area = getRoundedArea(area);

    /* calcula el precio */
    amount = amount * area;

    console.log('====================================');
    console.log('PRECIO DE REFERENCIA', amount);
    console.log('SUPERFICIE M2', area);
    console.log('====================================');

    /* si el ancho original es menor que un metro se le suma el precio del riel, de lo contrario, si es mayor que un metro se multiplica el ancho por el precio del riel + el precio */

    const railPrice = await db.System.findByPk(360);

    amount = width < 1 ? amount + railPrice.price : amount + (width * railPrice.price);

    console.log('====================================');
    console.log('VALOR DEL RIEL', railPrice.price);
    console.log('PRECIO + VALOR DEL RIEL', amount);
    console.log('====================================');

    return amount

  } catch (error) {
    console.log(error)
  }
}