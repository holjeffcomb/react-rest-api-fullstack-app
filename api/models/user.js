'use strict';
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Sequelize.Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   this.hasMany(models.Course, {
    //     as: 'Owner',
    //     foreignKey: {
    //       fieldName: 'userId',
    //       allowNull: false
    //     }
    //   })
    // }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required'
        },
        notEmpty: {
          msg: 'Please provide a first name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: {
          msg: 'An email is required'
        },
        notEmpty: {
          msg: 'Please provide an email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      set(val){
        this.setDataValue('password', bcrypt.hashSync(val, 10));
      },  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) =>{
    User.hasMany(models.Course,{
        as: 'Owner',
        foreignKey:{
            fieldName: 'userId',
            allowNull: false
        }
    })
  }

  return User;
};