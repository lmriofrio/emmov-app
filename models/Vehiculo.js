////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////

const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Vehiculo = sequelize.define('registro-vehiculos', {

  placa: {
    type: DataTypes.STRING(12),
    allowNull: false,
    primaryKey: true
  },
  clase_vehiculo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipo_vehiculo: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  clase_transporte: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipo_peso: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  id_usuario: {
    type: DataTypes.STRING(13),
    allowNull: true
  },
  nombre_usuario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  canton_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  celular_usuario: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  email_usuario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_ultimo_proceso: {
    type: DataTypes.STRING (20),
    allowNull: true
  },
  id_funcionario: {
    type: DataTypes.INTEGER (15),
    allowNull: true
  },
  username: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  id_centro_matriculacion: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
}, {
  timestamps: false 
});

module.exports = Vehiculo;