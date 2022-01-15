'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chain.hasMany(models.Quotation,{
        foreignKey : 'chainId',
        as : 'quotations'
      })
    }
  };
  Chain.init({
    name: DataTypes.DECIMAL,
    price: DataTypes.INTEGER,
    visible : DataTypes.BOOLEAN,
    idLocal : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Chain',
    paranoid : true
  });
  return Chain;
};