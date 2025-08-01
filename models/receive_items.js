// const sql = require('mssql');

// async function getAllReceiveItems() {
//   try {
//     const pool = await sql.connect();
//     const result = await pool.request().query('SELECT * FROM receive_items');
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   }
// }

const ReceiveItemSchema = {
  id: String,
  requestId: String,
  department: String,
  items: String,
  quantity: Number,
  priority: String,
  requestedBy: String,
  status: String,
  date: String,
  time: String,
  receivedDate: String,
  receivedTime: String,
};

module.exports = {
  getAllReceiveItems,
  ReceiveItemSchema,
}; 