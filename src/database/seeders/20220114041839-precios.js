'use strict';
const precios = require('../../data/precios_db.json');

const prices = precios.map(({systemId,clothId,colorId,amount,idLocal,visible} )=> {
  return {
    systemId,
    clothId,
    colorId,
    amount,
    idLocal,
    visible,
    createdAt : new Date,
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Prices', prices, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Prices', null, {});
       }
};
