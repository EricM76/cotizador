'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderQuotations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quotationId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Quotations'
          },
          key : 'id'
        },
        onDelete : 'cascade',
        onUpdate : 'cascade'
      },
      orderId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Orders'
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
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrderQuotations');
  }
};