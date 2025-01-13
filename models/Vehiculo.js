//////////////////////////////////////////////
///// ==    ACTUALIZADO ==     20-11-2024 ////
//////////////////////////////////////////////

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


  const Vehiculo = sequelize.define('registro-vehiculos', {
    placa: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    ramw: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    chasis: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    motor: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    pais_origen: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    marca: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    año_modelo: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    combustible: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    cilindraje: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    tipo_peso: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    clase_vehiculo_tipo: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    clase_vehiculo: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    tipo_vehiculo: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    clase_transporte: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    id_usuario: {
      type: DataTypes.STRING(17),
      allowNull: true
    },
    tipo_id_usuario: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    nombre_usuario: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    provincia_usuario: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    canton_usuario: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    parroquia_usuario: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    direccion_usuario: {
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
      type: DataTypes.STRING(20),
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
    id_empresa: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nombre_corto_empresa: {
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

  module.exports = Vehiculo;


