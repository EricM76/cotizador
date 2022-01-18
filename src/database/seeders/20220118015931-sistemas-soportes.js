'use strict';

const data = require('../../data/sistemas-soportes.json');

const SystemSupports = [];

data.forEach(system => {
    system.supports.forEach(support => {
      SystemSupports.push({
        systemId : system.id,
        supportId : support,
        createdAt : new Date,
        updatedAt : new Date
      })
    })
});


module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('SystemSupports', SystemSupports, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('SystemSupports', null, {});
       }
};
