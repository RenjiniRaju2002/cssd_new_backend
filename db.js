// // require('dotenv').config();
// // const sql = require('mssql');

// // const dbConfig = {
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   server: process.env.DB_SERVER,
// //   database: process.env.DB_DATABASE,
// //   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
// //   options: {
// //     encrypt: true, // for Azure
// //     trustServerCertificate: true, // change to false for production
// //   },
// // };

// // const poolPromise = new sql.ConnectionPool(dbConfig)
// //   .connect()
// //   .then(pool => {
// //     console.log('Connected to MSSQL');
// //     return pool;
// //   })
// //   .catch(err => {
// //     console.error('Database Connection Failed! Bad Config: ', err);
// //     throw err;
// //   });

// // module.exports = {
// //   sql,
// //   poolPromise
// // };


// import sql from 'mssql';

// const config = {
//   user: process.env.MSSQL_USER,
//   password: process.env.MSSQL_PASSWORD,
//   server: process.env.MSSQL_SERVER,
//   database: process.env.MSSQL_DATABASE,
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000
//   },
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//     enableArithAbort: true,
//     connectTimeout: 30000,
//     requestTimeout: 30000
//   },
//   connectionTimeout: 30000,
//   requestTimeout: 30000
// };

// const poolPromise = new sql.ConnectionPool(config)
//   .connect()
//   .then(pool => {
//     console.log('Connected to MSSQL');
//     return pool;
//   })
//   .catch(err => {
//     console.error('Database Connection Failed! Bad Config: ', err);
//     throw err;
//   });

// module.exports = {
//   sql,
//   poolPromise
// };


require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('✅ Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database Connection Failed! Bad Config:', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
