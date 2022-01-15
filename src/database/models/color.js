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
        foreignKey : 'colorId',
        as : 'prices'
      })
      Color.hasMany(models.Quotation,{
        foreignKey : 'colorId',
        as : 'quotations'
      })
      Color.belongsToMany(models.System,{
        as : 'systems',
        through : 'SystemColor',
        foreignKey : 'colorId',
        otherKey : 'systemId'
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