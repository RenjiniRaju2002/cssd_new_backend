// const sql = require('mssql');

// async function getAllCreatedKits() {
//   try {
//     const pool = await sql.connect();
//     const result = await pool.request().query('SELECT * FROM createdKits');
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   }
// }

const CreatedKitSchema = {
  id: String,
  name: String,
  department: String,
  items: String,
  quantity: Number,
  priority: String,
  requestedBy: String,
  status: String,
  date: String,
  time: String,
};

module.exports = {
  getAllCreatedKits,
  CreatedKitSchema,
}; 