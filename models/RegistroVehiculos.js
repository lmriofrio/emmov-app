const { DataTypes } = require('sequelize');
const db = require('../db');

const RegistroVehiculos = db.define('registro-vehiculos', {
  placa: {
    type: DataTypes.STRING(13),
    allowNull: false,
    primaryKey: true,
  },
  clase_vehiculo: {
    type: DataTypes.STRING(45),
    allowNull: true // Permitir valores nulos
  },
  clase_transporte: {
    type: DataTypes.STRING(45),
    allowNull: true // Permitir valores nulos
  },
  id_usuario: {
    type: DataTypes.STRING(13),
    allowNull: false // Permitir valores nulos
  },
  nombre_usuario: {
    type: DataTypes.STRING(45),
    allowNull: false // Permitir valores nulos
  },
  canton_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true // Permitir valores nulos
  },
  celular_usuario: {
    type: DataTypes.STRING(10),
    allowNull: true // Permitir valores nulos
  },
  email_usuario: {
    type: DataTypes.STRING(50),
    allowNull: true // Permitir valores nulos
  },
  fecha_ultimo_proceso: {
    type: DataTypes.STRING(100),
    allowNull: true // Permitir valores nulos
  },
  id_funcionario: {
    type: DataTypes.STRING(10),
    allowNull: true // Permitir valores nulos
  },
  id_centro_matriculacion: {
    type: DataTypes.STRING(50),
    allowNull: true // Permitir valores nulos
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true // Permitir valores nulos
  },


}, {
  tableName: 'registro-vehiculos',
  timestamps: false,
});

module.exports = RegistroVehiculos;
