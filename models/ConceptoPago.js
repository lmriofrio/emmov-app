const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ConceptoPago = sequelize.define('registro-conceptos-pago', {

  id_concepto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  tipo_servicio_concepto: {
    type: DataTypes.STRING(80),
    allowNull: true
  },

  nombre_concepto_abreviado: {
    type: DataTypes.STRING(120),
    allowNull: true
  },

  nombre_concepto: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  valor_concepto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  categoria_concepto: {
    type: DataTypes.STRING(80),
    allowNull: true
  },

  estado_concepto: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
    allowNull: true
  },

  fecha_creacion_concepto: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }

}, {

  tableName: 'registro-conceptos-pago',
  timestamps: false,
  indexes: []

});

module.exports = ConceptoPago;
