'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Color.hasMany(models.Price,{
        foreignKey : colorId,
        as : 'price'
      })
      Color.hasMany(models.Quotation,{
        foreignKey : colorId,
        as : 'quotation'
      })
    }
  };
  Color.init({
    name: DataTypes.STRING,
    visible : DataTypes.BOOLEAN,
    idLocal : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Color',
    paranoid : true
  });
  return Color;
};