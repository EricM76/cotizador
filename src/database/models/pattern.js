'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pattern extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pattern.hasMany(models.Quotation,{
        foreignKey : 'patternId',
        as : 'quotations'
      })
      Pattern.belongsToMany(models.System,{
        as : 'systems',
        through : 'SystemPattern',
        foreignKey : 'patternId',
        otherKey : 'systemId'
      })
    }
  };
  Pattern.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    visible : DataTypes.BOOLEAN,
    idLocal : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Pattern',
    paranoid : true
  });
  return Pattern;
};