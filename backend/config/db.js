const mysql = require('mysql2');
const config = require('config');

const dbConfig = config.get('dbConfig');

const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();
