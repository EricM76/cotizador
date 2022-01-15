'use strict';
const soportes = require('../../data/soportes_db.json');

const supports = soportes.map(({name,visible,idLocal,price} )=> {
  return {
    name,
    price,
    idLocal,
    visible,
    createdAt : new Date,
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Supports', supports, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Supports', null, {});
       }
};
