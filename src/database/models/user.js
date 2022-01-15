'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Quotation,{
        foreignKey : userId,
        as : 'quotation'
      })
      User.belongsTo(models.Rol,{
        foreignKey : rolId,
        as: 'rol'
      })
      User.hasMany(models.Reference,{
        foreignKey : 'userId',
        as : 'references',
        onDelete : 'cascade'
      })
    }
  };
  User.init({
    name : DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone : DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    rolId: DataTypes.INTEGER,
    idLocal : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
    paranoid : true
  });
  return User;
};