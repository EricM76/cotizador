'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SystemChain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SystemChain.init({
    systemId: DataTypes.INTEGER,
    chainId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SystemChain',
  });
  return SystemChain;
};