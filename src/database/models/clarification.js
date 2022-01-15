'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clarification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clarification.belongsTo(models.System,{
        foreignKey : 'systemId',
        as : 'system'
      })
    }
  };
  Clarification.init({
    description: DataTypes.TEXT,
    systemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Clarification',
  });
  return Clarification;
};