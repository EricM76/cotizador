'use strict';

const data = require('../../data/sistemas-colores.json');

const SystemColors = [];

data.forEach(system => {
    system.colors.forEach(color => {
      SystemColors.push({
        systemId : system.id,
        colorId : color,
        createdAt : new Date,
        updatedAt : new Date
      })
    })
});


module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('SystemColors', SystemColors, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('SystemColors', null, {});
       }
};
