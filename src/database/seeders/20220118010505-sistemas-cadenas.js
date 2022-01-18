'use strict';

let data = require('../../data/sistemas-cadenas.json')

const SystemChains = [];

data.forEach(system => {
    system.chains.forEach(chain => {
      SystemChains.push({
        systemId : system.id,
        chainId : chain,
        createdAt : new Date,
        updatedAt : new Date
      })
    })
});


module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('SystemChains', SystemChains, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('SystemChains', null, {});
       }
};
