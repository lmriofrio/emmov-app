////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Usuario = sequelize.define('registro-usuarios', {

  id_usuario: {
    type: DataTypes.STRING(13),
    primaryKey: true,
    autoIncrement: false,
  },
  tipo_id_usuario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  canton_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  celular_usuario: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fecha_ultimo_proceso: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  id_funcionario: {
    type: DataTypes.INTEGER(15),
    allowNull: true
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  id_centro_matriculacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
}, {
  timestamps: false,
  indexes: []
});

module.exports = Usuario;
