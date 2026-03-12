const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Documento = sequelize.define('registro-documentos', {

  id_documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  nombre_original_documento: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  nombre_servidor_documento: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },

  ruta_carpeta_documento: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  mimetype_documento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  tamano_documento: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  id_referencia_documento: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  fecha_creacion_documento: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },

  fecha_actualizacion__documento: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'registro-documentos',
  timestamps: false, 
  indexes: [
    {
      unique: true,
      fields: ['nombre_servidor_documento']
    }
  ]
});

module.exports = Documento;