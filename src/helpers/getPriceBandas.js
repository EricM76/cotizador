const db = require('../database/models');
const getRoundedArea = require('./getRoundedArea');

module.exports = async (width, heigth, amount, chain, pattern) => {
  console.log('====================================');
  console.log('ANCHO RECIBIDO', width);
  console.log('====================================');
  try {

    /* si el ancho es menor a 100, lo fijo en 100 */
    width = +width < 100 ? 100 : +width;
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

    console.log('====================================');
    console.log('AREA', area);
    console.log('====================================');

    /* si la superficie es menor a dos, lo fijo en dos o queda se redondea el decimal en cinco o se suma un entero */

    area = getRoundedArea(area);

    /* calculo el precio multiplicando precio x superficie */
    console.log('====================================');
    console.log('SUPERFICIE', area);
    console.log('PRECIO DE REFERENCIA', amount);
    console.log('====================================');
    amount = amount * area;


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

    console.log('====================================');
    console.log('PRECIO CADENA', priceChain.price);
    console.log('MONTO ACUMULADO', amount);
    console.log('====================================');

    amount = priceChain ? amount + priceChain.price : amount;

    return amount

  } catch (error) {
    console.log(error)
  }

}