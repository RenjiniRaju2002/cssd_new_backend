// const sql = require('mssql');

// async function getAllConsumptionRecords() {
//   try {
//     const pool = await sql.connect();
//     const result = await pool.request().query('SELECT * FROM consumptionRecords');
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   }
// }

const ConsumptionRecordSchema = {
  id: String,
  type: String,
  dept: String,
  date: String,
  before: Number,
  after: Number,
  used: Number,
  items: String,
  requestId: String,
  kitId: String,
};

module.exports = ConsumptionRecordSchema; 