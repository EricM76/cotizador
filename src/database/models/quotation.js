'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quotation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Quotation.belongsTo(models.System,{
        foreignKey : 'systemId',
        as : 'system'
      })
      Quotation.belongsTo(models.Cloth,{
        foreignKey : 'clothId',
        as : 'cloth'
      })
      Quotation.belongsTo(models.Color,{
        foreignKey : 'colorId',
        as : 'color'
      })
      Quotation.belongsTo(models.Support,{
        foreignKey : 'supportId',
        as : 'support'
      })
      Quotation.belongsTo(models.Pattern,{
        foreignKey : 'patternId',
        as : 'pattern'
      })
      Quotation.belongsTo(models.Chain,{
        foreignKey : 'chainId',
        as : 'chain'
      })
      Quotation.belongsTo(models.User,{
        foreignKey : 'userId',
        as : 'user'
      })
    /*   Quotation.belongsTo(models.Reference,{
        foreignKey : 'referenceId',
        as : 'reference'
      }) */
      Quotation.belongsToMany(models.Order,{
        as : 'orders',
        through : 'OrderQuotation',
        foreignKey : 'quotationId',
        otherKey : 'orderId'
      })
    }
  };
  Quotation.init({
    railsQuantity: DataTypes.INTEGER,
    railWidth: DataTypes.INTEGER,
    clothsQuantity: DataTypes.INTEGER,
    clothWidth: DataTypes.INTEGER,
    heigth: DataTypes.INTEGER,
    systemId: DataTypes.INTEGER,
    clothId: DataTypes.INTEGER,
    colorId: DataTypes.INTEGER,
    supportId: DataTypes.INTEGER,
    patternId: DataTypes.INTEGER,
    chainId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    date: DataTypes.DATE,
    reference : DataTypes.STRING,
    /* referenceId: DataTypes.INTEGER */
  }, {
    sequelize,
    modelName: 'Quotation',
    paranoid : true
  });
  return Quotation;
};