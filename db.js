const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '64.23.134.120',
  port: 3306,
  username: 'lmriofrio',
  password: 'lmriofrio',
  database: 'mydb',
  //64.23.134.120
});

module.exports = sequelize;
