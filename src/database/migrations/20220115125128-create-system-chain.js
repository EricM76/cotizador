'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SystemChains', {
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
        },
        onDelete : 'cascade',
        onUpdate : 'cascade'
      },
      chainId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Chains'
          },
          key : 'id'
        },
        onDelete : 'cascade',
        onUpdate : 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SystemChains');
  }
};