'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SystemPatterns', {
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
      patternId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Patterns'
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
    await queryInterface.dropTable('SystemPatterns');
  }
};