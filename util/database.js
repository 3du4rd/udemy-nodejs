require('dotenv').config();
const Sequelize = require('sequelize');

const user = process.env.PGUSER;
const host = process.env.PGHOST;
const database = process.env.PGDATABASE;
const password = process.env.PGPASSWORD;
const port = process.env.PGPORT;

// Passing parameters separately (other dialects)
const sequelize = new Sequelize(database, user, password, {
    host: host,
    port: port,
    dialect: 'postgres' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });

module.exports = sequelize;