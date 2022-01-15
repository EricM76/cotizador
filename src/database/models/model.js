'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Model.hasMany(models.Quotation,{
        foreignKey : modelId,
        as : 'quotation'
      })
    }
  };
  Model.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    visible : DataTypes.BOOLEAN,
    idLocal : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Model',
    paranoid : true
  });
  return Model;
};