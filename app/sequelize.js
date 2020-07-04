const Sequelize = require('sequelize');
const config = require('../config/config');

let dbCreds = config.development;

if (process.env.NODE_ENV == 'test') {
  dbCreds = config.test;
}

const sequelize = new Sequelize(dbCreds);

module.exports = sequelize;