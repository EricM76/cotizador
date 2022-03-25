'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Users'
          },
          key : 'id'
        },
      },
      observations: {
        type: Sequelize.TEXT
      },
      packaging: {
        type: Sequelize.INTEGER
      },
      fileClient:{
        type: Sequelize.STRING
      },
      fileAdmin:{
        type: Sequelize.STRING
      },
      send : {
        type: Sequelize.BOOLEAN
      },
      orderNumber : {
        type : Sequelize.STRING
      },
      total : {
        type : Sequelize.INTEGER
      },
      ticket : {
        type : Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  }
};