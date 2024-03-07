const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'lmriofrio',
  password: 'lmriofrio',
  database: 'mydb',
});

module.exports = sequelize;
