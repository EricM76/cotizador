'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Price.belongsTo(models.System,{
        foreignKey : 'systemId',
        as : 'system'
      })
      Price.belongsTo(models.Cloth,{
        foreignKey : 'clothId',
        as : 'cloth'
      })
      Price.belongsTo(models.Color,{
        foreignKey : 'colorId',
        as : 'color'
      })
    }
  };
  Price.init({
    systemId: DataTypes.INTEGER,
    clothId: DataTypes.INTEGER,
    colorId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    visible: DataTypes.INTEGER,
    idLocal : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Price',
  });
  return Price;
};