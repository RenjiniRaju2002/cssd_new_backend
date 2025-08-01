// const sql = require('mssql');

// async function getAllIssueItems() {
//   try {
//     const pool = await sql.connect();
//     const result = await pool.request().query('SELECT * FROM issueItems');
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   }
// }

const IssueItemSchema = {
  id: String,
  requestId: String,
  department: String,
  items: String,
  quantity: Number,
  issuedTime: String,
  issuedDate: String,
  status: String,
};

module.exports = IssueItemSchema; 