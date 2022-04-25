const db = require('../database/models');
const { sequelize } = require("../database/models");

module.exports = async (large, amount) => {

    try {

        /* si el ancho es menor a 100, lo fijo en 100 */
        large = +large < 100 ? 100 : +large;
        console.log('====================================');
        console.log('LARGO MINIMO', large);
        console.log('====================================');

        /* redondeo del decimal el ancho */
        let largeByMeter = +large / 100;
        largeDecimal = largeByMeter.toString().slice(2)[0];
        largeDecimal = !largeDecimal ? '0' : largeDecimal;

        switch (largeDecimal) {
            case '1':
            case '2':
                decimal = 2
                entero = Math.trunc(largeByMeter);
                large = entero + decimal / 10;
                break;
            case '3':
            case '4':
                decimal = 4
                entero = Math.trunc(largeByMeter);
                large = entero + decimal / 10;
                break;
            case '5':
            case '6':
                decimal = 6
                entero = Math.trunc(largeByMeter);
                large = entero + decimal / 10;
                break;
            case '7':
            case '8':
                decimal = 8
                entero = Math.trunc(largeByMeter);
                large = entero + decimal / 10;
                break;
            case '9':
                decimal = 0
                entero = Math.trunc(largeByMeter);
                large = entero + 1;
                break
            case '0':
                decimal = 0
                entero = Math.trunc(largeByMeter);
                large = entero;
                break
            default:
                break;
        }

        /* calculo el precio multiplicando el ancho obtenido por el precio */
        amount = large * amount;
        console.log('====================================');
        console.log('LARGO TOTAL', large);
        console.log('PRECIO REFERENCIA', large);
        console.log('====================================');
        return amount

    } catch (error) {
        console.log(error)
    }

}