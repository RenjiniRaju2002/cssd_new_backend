const { poolPromise } = require('./db');

poolPromise
  .then(pool => {
    console.log('MSSQL connection is working!');
    pool.close();
  })
  .catch(err => {
    console.error('Connection failed:', err);
  });
