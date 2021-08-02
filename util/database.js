const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: '***REMOVED***',
  database: 'postgres',
  password: '***REMOVED***',
  port: 5432,
});

module.exports = pool;