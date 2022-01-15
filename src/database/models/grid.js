'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Grid.init({
    width: DataTypes.INTEGER,
    heigth: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    idLocal : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Grid',
  });
  return Grid;
};