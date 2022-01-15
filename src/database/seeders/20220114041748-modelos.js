'use strict';
const modelos = require('../../data/modelos_db.json');

const models = modelos.map(({name,visible,idLocal,price} )=> {
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

      await queryInterface.bulkInsert('Patterns', models, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Patterns', null, {});
       }
};
