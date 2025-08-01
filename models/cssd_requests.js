// const sql = require('mssql');

// async function getAllCssdRequests() {
//   try {
//     const pool = await sql.connect();
//     const result = await pool.request().query('SELECT * FROM cssd_requests');
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   }
// }

const CssdRequestSchema = {
  id: String,
  department: String,
  items: String,
  quantity: Number,
  priority: String,
  requestedBy: String,
  status: String,
  date: String,
  time: String,
};

module.exports = CssdRequestSchema; 