'use strict';
const usuarios = require('../../data/usuarios_db.json');

const users = usuarios.map(({name,surname,email,idLocal} )=> {
  return {
    name,
    surname,
    email,
    idLocal,
    enabled : true,
    viewOrders : false,
    createdAt : new Date,
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Users', users, {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Users', null, {});
       }
};
