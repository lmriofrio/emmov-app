////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const InventarioPlacas = sequelize.define('registro-inventario-placas', {

  id_inventario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  placa: {
    type: DataTypes.STRING(12),
    allowNull: true
  },
  clase_vehiculo: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  clase_transporte: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  cantidad: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  ingreso_fecha: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipo_tramite: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  ingreso_id_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  ingreso_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  ingreso_nombre_puesto_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  ingreso_username: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  ingreso_id_empresa: {
    type: DataTypes.STRING (15),
    allowNull: true
  },
  ingreso_nombre_corto_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  id_usuario: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  tipo_id_usuario: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  nombre_usuario: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  id_gestor: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  tipo_id_gestor: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  nombre_gestor: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  nombre_casa_comercial: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  id_tercera_persona: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  tipo_id_tercera_persona: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  nombre_tercer_persona: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  salida_fecha: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  salida_funcionario: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  salida_nombre_puesto_funcionario: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  salida_username: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
}, {
  timestamps: false,
  indexes: [] 
});

module.exports = InventarioPlacas;
