'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Sequelize.Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   this.belongsTo(models.User, { 
    //     as: 'Owner', // alias
    //     foreignKey: {
    //       fieldName: 'userId',
    //       allowNull: false
    //     } 
    //   })
    // }
  };
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course title is required'
        },
        notEmpty: {
          msg: 'Please provide a course title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course description is required'
        },
        notEmpty: {
          msg: 'Please provide a course description'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) =>{
    Course.belongsTo(models.User,{
        as: 'Owner',
        foreignKey:{
            fieldName: 'userId'
        }
    })
  }

  return Course;
};