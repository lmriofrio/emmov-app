const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TramitesAtencion = sequelize.define(
  'registro-tramites-en-atencion',
  {
    id_en_atención: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    id_empresa: {
      type: DataTypes.STRING(45),
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
    nombre_centro_matriculacion: {
      type: DataTypes.STRING(45),
      allowNull: true
    },

    id_funcionario: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    nombre_funcionario_corto: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    estado_funcionario: {
      type: DataTypes.STRING(45),
      allowNull: true
    },

    placa_en_atención: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    id_tramite_en_atención: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado_en_atención: {
      type: DataTypes.STRING(15),
      allowNull: true
    }

  },
  {
    tableName: 'registro-tramites-en-atencion',
    timestamps: false
  }
);

module.exports = TramitesAtencion;


