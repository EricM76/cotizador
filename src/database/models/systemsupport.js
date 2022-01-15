'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SystemSupport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SystemSupport.init({
    systemId: DataTypes.INTEGER,
    supportId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SystemSupport',
  });
  return SystemSupport;
};