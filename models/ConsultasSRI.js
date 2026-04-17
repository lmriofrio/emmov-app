const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ConsultasSRI = sequelize.define('registro-consultas-sri', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    primaryKey: true,
    autoIncrement: true
  },

  id_consulta_sri: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  placa: {
    type: DataTypes.STRING(10),
    allowNull: true
  },

  id_tramite: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  descripcion_rubro: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  valor: { // Cambiado de valor_rubro a valor para coincidir con tu tabla
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },

  tiene_deudas: {
    type: DataTypes.STRING(10),
    allowNull: true
  },

  fecha_consulta: {
    type: DataTypes.STRING(10),
    allowNull: true,
  }
}, {
  tableName: 'registro-consultas-sri',
  timestamps: false,
});

module.exports = ConsultasSRI;