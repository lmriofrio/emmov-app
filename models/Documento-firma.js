const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DocumentoFirma = sequelize.define('registro-documentos-firmas', {

  id_documento_firma: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  nombre_original_documento_firma: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  nombre_servidor_documento_firma: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },

  ruta_carpeta_documento_firma: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  mimetype_documento_firma: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  fecha_creacion_documento_firma: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: DataTypes.NOW
  },

  id_funcionario_documento_firma: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  tableName: 'registro-documentos-firmas',
  timestamps: false, 
  indexes: [
    {
      unique: true,
      fields: ['nombre_servidor_documento_firma']
    },
    {
      fields: ['id_funcionario_documento_firma']
    }
  ]
});

module.exports = DocumentoFirma;