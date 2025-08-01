// const sql = require('mssql');

// async function getAllSterilizationProcesses() {
//   try {
//     const pool = await sql.connect();
//     const result = await pool.request().query('SELECT * FROM sterilizationProcesses');
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   }
// }

const SterilizationProcessSchema = {
  id: String,
  machine: String,
  process: String,
  itemId: String,
  startTime: String,
  endTime: String,
  status: String,
  duration: Number,
};

module.exports = SterilizationProcessSchema; 