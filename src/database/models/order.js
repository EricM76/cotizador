'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsToMany(models.Quotation,{
        as: 'quotations',
        through : 'OrderQuotation',
        foreignKey : 'orderId',
        otherKey : 'quotationId',
      })
      Order.belongsTo(models.User,{
        foreignKey : 'userId',
        as : 'user'
      })
    }
  };
  Order.init({
    userId: DataTypes.INTEGER,
    observations: DataTypes.TEXT,
    send: DataTypes.BOOLEAN,
    packaging: DataTypes.INTEGER,
    fileClient: DataTypes.STRING,
    fileAdmin: DataTypes.STRING,
    orderNumber: DataTypes.STRING,
    total :DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
    paranoid : true
  });
  return Order;
};