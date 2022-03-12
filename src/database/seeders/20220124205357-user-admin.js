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
            name: "Control",
            surname: "Blancomad",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "control",
            password: bcrypt.hashSync('123', 10),
            rolId: 2
         },
         {
            name: "Medidor",
            surname: "Blancomad",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "medidor",
            password: bcrypt.hashSync('123', 10),
            rolId: 3
         },
         {
            name: "Test 0%",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "test0",
            password: bcrypt.hashSync('123', 10),
            rolId: 4
         },
         {
            name: "Test -5%",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "test5",
            password: bcrypt.hashSync('123', 10),
            rolId: 5
         },
         {
            name: "Test -10%",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "test10",
            password: bcrypt.hashSync('123', 10),
            rolId: 6
         },
         {
            name: "Test -15%",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "test15",
            password: bcrypt.hashSync('123', 10),
            rolId: 7
         },
         {
            name: "Test -20%",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "test20",
            password: bcrypt.hashSync('123', 10),
            rolId: 8
         },
         {
            name: "Test +80%",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "test80",
            password: bcrypt.hashSync('123', 10),
            rolId: 9
         },
         {
            name: "Test Tarjeta",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "tarjeta",
            password: bcrypt.hashSync('123', 10),
            rolId: 10
         },
         {
            name: "Test +5%",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "test5+",
            password: bcrypt.hashSync('123', 10),
            rolId: 11
         },
         {
            name: "Test Instagram",
            surname: "example",
            email: "menaericdaniel@gmail.com",
            idLocal: 9999,
            enabled: true,
            createdAt: new Date,
            phone: '11 3401-6900',
            username: "instagram",
            password: bcrypt.hashSync('123', 10),
            rolId: 12
         }
      ], {});

   },

   down: async (queryInterface, Sequelize) => {

      await queryInterface.bulkDelete('Users', null, {});

   }
};
