// models/canton.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Canton = sequelize.define('registro-cantones', {
  id_canton: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_canton: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
}, {
 
  tableName: 'registro-cantones',
  timestamps: false 
});

module.exports = Canton;
