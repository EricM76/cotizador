'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkInsert('Users', [{
      name : "Administrador",
      surname : "Blancomad",
      email : "info@blancomad.com",
      idLocal : null,
      enabled : true,
      createdAt : new Date,
      phone : '(011) 4504-8563 / (011) 4503-3241',
      username : "admin1234",
      password : bcrypt.hashSync('admin1234', 10),
      rolId : 1
     }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
  
     await queryInterface.bulkDelete('Users', null, {});
     
  }
};
