'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SystemCloth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SystemCloth.init({
    systemId: DataTypes.INTEGER,
    clothId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SystemCloth',
  });
  return SystemCloth;
};