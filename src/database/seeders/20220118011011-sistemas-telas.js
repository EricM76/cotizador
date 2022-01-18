'use strict';

const data = require('../../data/sistemas-telas.json');

const SystemCloths = [];

data.forEach(system => {
    system.cloths.forEach(cloth => {
      SystemCloths.push({
        systemId : system.id,
        clothId : cloth,
        createdAt : new Date,
        updatedAt : new Date
      })
    })
});


module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('SystemCloths', SystemCloths, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('SystemCloths', null, {});
       }
};
