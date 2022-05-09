'use strict';
const sistemas = require('../../data/sistemas_db.json');

const systems = sistemas.map(({name,visible,accessory,limit,salePrice,idLocal,price} )=> {
  return {
    name,
    price,
    idLocal,
    visible,
    accessory,
    salePrice,
    limit,
    createdAt : new Date,
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Systems', systems, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Systems', null, {});
       }
};
