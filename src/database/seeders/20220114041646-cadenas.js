'use strict';
const cadenas = require('../../data/cadenas_db.json');

const chains = cadenas.map(({name,visible,idLocal,price} )=> {
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

      await queryInterface.bulkInsert('Chains', chains, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Chains', null, {});
       }
};
