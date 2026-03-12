const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TituloCredito = sequelize.define('registro-titulos-credito', {

  id_titulos_credito: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  id_tramite: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

  nombre_concepto: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  cantidad_concepto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  valor_unitario_concepto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  subtotal_concepto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  fecha_titulo_credito: {
    type: DataTypes.DATE,
    allowNull: true
  },

  estado_titulo_credito: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

    placa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

    id_usuario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

    nombre_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  }

}, {

  tableName: 'registro-titulos-credito',
  timestamps: false,
  indexes: []

});

module.exports = TituloCredito;
