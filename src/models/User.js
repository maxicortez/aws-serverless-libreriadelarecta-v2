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
      // define association here
    }
  }
  User.init({
    username: {
      type:DataTypes.STRING, 
      validate: {
          isAlpha: {
              args: true,
              msg: "El nombre de usuario debe contener solamente letras"
          },
          len: {
              args: [6,20],
              msg: "El nombre de usuario debe contener entre 6 y 20 caracteres"
          }
      }
    },
    email: {
      type:DataTypes.STRING, 
      validate: {
          isEmail: {
              args: true,
              msg: "El email ingresado no es válido"
          }
      }
    },
    password: {
      type: DataTypes.STRING
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      validate: {
        isBoolean: (value) => {
          if (typeof value !== "boolean") {
            throw new Error("El campo Blocked solo permite valores 'true' o 'false'")
          }
        },
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};