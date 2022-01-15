'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Prices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      systemId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Systems'
          },
          key : 'id'
        }
      },
      clothId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Cloths'
          },
          key : 'id'
        }
      },
      colorId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Colors'
          },
          key : 'id'
        }
      },
      amount: {
        type: Sequelize.INTEGER
      },
      visible :{
        type: Sequelize.INTEGER
      },
      idLocal :{
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Prices');
  }
};