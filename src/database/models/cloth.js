"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cloth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cloth.hasMany(models.Price, {
        foreignKey: "clothId",
        as: "prices",
      });
      Cloth.hasMany(models.Quotation, {
        foreignKey: "clothId",
        as: "quotations",
      });
      Cloth.belongsToMany(models.System, {
        as: "systems",
        through: "SystemCloth",
        foreignKey: "clothId",
        otherKey: "systemId",
      });
    }
  }
  Cloth.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      visible: DataTypes.BOOLEAN,
      idLocal: DataTypes.INTEGER,
      width: DataTypes.DECIMAL
    },
    {
      sequelize,
      modelName: "Cloth",
      paranoid: true,
    }
  );
  return Cloth;
};
