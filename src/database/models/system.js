'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class System extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      System.hasMany(models.Price,{
        foreignKey : 'systemId',
        as : 'prices'
      })
      System.hasMany(models.Quotation,{
        foreignKey : 'systemId',
        as : 'quotations'
      })
      System.hasMany(models.Clarification,{
        foreignKey : 'systemId',
        as : 'clarifications',
        onDelete : 'cascade'
      })
    }
  };
  System.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    visible : DataTypes.BOOLEAN,
    idLocal : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'System',
    paranoid : true
  });
  return System;
};