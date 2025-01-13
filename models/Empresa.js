////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const Empresa = sequelize.define('registro-empresas', {


  id_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true,
    primaryKey: true
  },
  nombre_empresa: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nombre_corto_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_empresa_logo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipo_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  provincia_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  canton_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  domicilio_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  telefono_empresa: {
    type: DataTypes.STRING(9),
    allowNull: true
  },
  celular_empresa: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  email_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_ingreso_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_finalizacion_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  id_representante_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_representante_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  cargo_representante_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
}, {
 
  tableName: 'registro-empresas',
  timestamps: false,
  indexes: []
});

module.exports = Empresa;

