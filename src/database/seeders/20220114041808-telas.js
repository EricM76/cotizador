'use strict';
const telas = require('../../data/telas_db.json');

const cloths = telas.map(({name,visible,idLocal,price,width})=> {
  return {
    name,
    price,
    width,
    idLocal,
    visible,
    createdAt : new Date,
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Cloths', cloths, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Cloths', null, {});
       }
};
