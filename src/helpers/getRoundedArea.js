module.exports = (area) => {
    if (area < 2) {
        area = 2
      } else {
        area = +area.toFixed(1);
        console.log('====================================');
        console.log('AREA SUPERIOR A 2 m', area);
        console.log('====================================');
        /* extraigo el decimal */
        areaDecimal = area.toString().slice(2)[0];
        console.log('====================================');
        console.log('DECIMAL DEL AREA', areaDecimal);
        console.log('====================================');
        /* si existe un decimal en el area */
        let decimal;
        let entero;
        if (areaDecimal) {
          if (+areaDecimal <= 5) {
            decimal = 5;
            entero = Math.trunc(+area);
            area = entero + +decimal / 10;
            console.log('====================================');
            console.log('DECIMAL REDONDEADO EN 5', decimal);
            console.log('ENTERO REDONDEADO EN 5', entero);
            console.log('TOTAL REDONDEADO EN 5', area);
            console.log('====================================');
          } else {
            decimal = 0;
            entero = Math.trunc(+area);
            area = entero + 1;
            console.log('====================================');
            console.log('SIGUIENTE ENTERO', entero, area);
            console.log('====================================');
          }
        }
      }
      return area
}