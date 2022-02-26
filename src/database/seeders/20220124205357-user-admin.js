'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
   up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Users', [
         {
            name: "Administrador",
            surname: "Blancomad",
            email: "info@blancomad.com",
            idLocal: null,
            enabled: true,
            createdAt: new Date,
            phone: '(011) 4504-8563 / (011) 4503-3241',
            username: "admin1234",
            password: bcrypt.hashSync('admin1234', 10),
            rolId: 1
         },
         {
            name: "Developer",
            surname: "Test",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "test",
            password: bcrypt.hashSync('123', 10),
            rolId: 2
         }
      ], {});

   },

   down: async (queryInterface, Sequelize) => {

      await queryInterface.bulkDelete('Users', null, {});

   }
};
