'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Quotations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      railsQuantity: {
        type: Sequelize.INTEGER,
      },
      railWidth: {
        type: Sequelize.INTEGER
      },
      clothsQuantity: {
        type: Sequelize.INTEGER
      },
      clothWidth: {
        type: Sequelize.INTEGER
      },
      heigth: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
     /*  referenceId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'References'
          },
          key : 'id'
        }
      }, */
      reference: {
        type: Sequelize.STRING,
      },
      command : {
        type : Sequelize.STRING,
      },
      supportOrientation : {
        type : Sequelize.STRING,
      },
      clothOrientation : {
        type : Sequelize.STRING,
      },
      observations : {
        type : Sequelize.TEXT,
      },
      quantity : {
        type : Sequelize.INTEGER,
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
      supportId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Supports'
          },
          key : 'id'
        }
      },
      patternId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Patterns'
          },
          key : 'id'
        }
      },
      chainId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Chains'
          },
          key : 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references : {
          model : {
            tableName : 'Users'
          },
          key : 'id'
        }
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
    await queryInterface.dropTable('Quotations');
  }
};