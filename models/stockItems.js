// const sql = require('mssql');

// async function getAllStockItems() {
//   try {
//     const pool = await sql.connect();
//     const result = await pool.request().query('SELECT * FROM stockItems');
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   }
// }

const StockItemSchema = {
  id: String,
  name: String,
  category: String,
  quantity: Number,
  location: String,
  minLevel: Number,
  status: String,
};

module.exports = StockItemSchema; 