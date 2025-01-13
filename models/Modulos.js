////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const Modulos = sequelize.define('registro-modulos', {


    id_modulo: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    primaryKey: true
  },
  nombre_modulo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  descripcion_modulo: {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
 
  tableName: 'registro-modulos',
  timestamps: false,
  indexes: []
});

module.exports = Modulos;

