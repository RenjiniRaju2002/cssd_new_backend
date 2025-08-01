// const sql = require('mssql');

// async function getAllAvailableItems() {
//   try {
//     const pool = await sql.connect();
//     const result = await pool.request().query('SELECT * FROM availableItems');
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   }
// }

const AvailableItemSchema = {
  id: String,
  department: String,
  items: String,
  quantity: Number,
  status: String,
  readyTime: String,
  sterilizationId: String,
  machine: String,
  process: String,
};

module.exports = AvailableItemSchema; 