'use strict';
const grilla = require('../../data/grilla_db.json');

const grids = grilla.map(({width,heigth,price,visible,idLocal} )=> {
  return {
    width,
    heigth,
    price,
    visible,
    idLocal,
    createdAt : new Date,
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Grids', grids, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Grids', null, {});
       }
};
