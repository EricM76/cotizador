'use strict';
const colores = require('../../data/colores_db.json');

const colors = colores.map(({name,visible,idLocal} )=> {
  return {
    name,
    visible,
    idLocal,
    createdAt : new Date,
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Colors', colors, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Colors', null, {});
       }
};
