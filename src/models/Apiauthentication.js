'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apiauthentication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Apiauthentication.init({
    endpoint: DataTypes.STRING,
    method: DataTypes.STRING,
    blocked: DataTypes.BOOLEAN,
    ahtenticated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Apiauthentication',
  });
  return Apiauthentication;
};