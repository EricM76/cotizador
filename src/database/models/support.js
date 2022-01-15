'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Support extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Support.hasMany(models.Quotation,{
        foreignKey : 'supportId',
        as : 'quotations'
      })
    }
  };
  Support.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    visible : DataTypes.BOOLEAN,
    idLocal : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Support',
    paranoid : true
  });
  return Support;
};