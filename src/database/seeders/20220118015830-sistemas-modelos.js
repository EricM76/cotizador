'use strict';

const data = require('../../data/sistemas-modelos.json');

const SystemPatterns = [];

data.forEach(system => {
    system.patterns.forEach(pattern => {
      SystemPatterns.push({
        systemId : system.id,
        patternId : pattern,
        createdAt : new Date,
        updatedAt : new Date
      })
    })
});


module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('SystemPatterns', SystemPatterns, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('SystemPatterns', null, {});
       }
};
