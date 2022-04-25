const db = require('../database/models');
const getRoundedArea = require('./getRoundedArea');

module.exports = async (width, heigth, amount, pattern, chain) => {

  try {

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
    area = getRoundedArea(area);

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

    return amount

  } catch (error) {
    console.log(error)
  }
}