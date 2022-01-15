'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reference.belongsTo(models.User,{
        foreignKey : 'userId',
        as : 'user'
      })
      Reference.hasMany(models.Quotation,{
        foreignKey : 'referenceId',
        as : 'quotation'
      })
    }
  };
  Reference.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reference',
  });
  return Reference;
};