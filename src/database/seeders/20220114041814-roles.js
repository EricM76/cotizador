'use strict';
const roles = require('../../data/rols_db.json');

const rols = roles.map( rol => {
  return {
    name : rol,
    createdAt : new Date,
    updatedAt : new Date,

  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Rols', rols, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Rols', null, {});
       }
};
