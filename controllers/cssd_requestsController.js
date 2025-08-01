// const fs = require('fs');
// const path = require('path');
// const dbFilePath = path.join(__dirname, '../db.json');
// const db = require('../db.json');

// const cssd_requests = db['cssd_requests'];

// function saveDb() {
//   fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
// }

// exports.getAll = (req, res) => {
//   res.json(cssd_requests);
// };

// exports.getById = (req, res) => {
//   const item = cssd_requests.find(i => i.id === req.params.id);
//   if (!item) return res.status(404).json({ error: 'Not found' });
//   res.json(item);
// };

// exports.create = (req, res) => {
//   const item = req.body;
//   cssd_requests.push(item);
//   saveDb();
//   res.status(201).json(item);
// };

// exports.update = (req, res) => {
//   const idx = cssd_requests.findIndex(i => i.id === req.params.id);
//   if (idx === -1) return res.status(404).json({ error: 'Not found' });
//   cssd_requests[idx] = { ...cssd_requests[idx], ...req.body };
//   saveDb();
//   res.json(cssd_requests[idx]);
// };

// exports.remove = (req, res) => {
//   const idx = cssd_requests.findIndex(i => i.id === req.params.id);
//   if (idx === -1) return res.status(404).json({ error: 'Not found' });
//   const removed = cssd_requests.splice(idx, 1);
//   saveDb();
//   res.json(removed[0]);
// }; 




const sql = require('mssql');
const dbConfig = require('../db');

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM CSSD_request');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching cssd_requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM CSSD_request WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// CREATE
exports.create = async (req, res) => {
  const { id, department, items, quantity, priority, status, date, time } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.VarChar, id)
      .input('department', sql.VarChar, department)
      .input('items', sql.VarChar, items)
      .input('quantity', sql.Int, quantity)
      .input('priority', sql.VarChar, priority)
      .input('status', sql.VarChar, status)
      .input('date', sql.VarChar, date)
      .input('time', sql.VarChar, time)
      .query(`
        INSERT INTO CSSD_request (id, department, items, quantity, priority, status, date, time)
        VALUES (@id, @department, @items, @quantity, @priority, @status, @date, @time)
      `);

    res.status(201).json({ id, department, items, quantity, priority, status, date, time });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// UPDATE
exports.update = async (req, res) => {
  const { id } = req.params;
  const { department, items, quantity, priority, status, date, time } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const check = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM cssd_requests WHERE id = @id');

    if (check.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    await pool.request()
      .input('id', sql.VarChar, id)
      .input('department', sql.VarChar, department)
      .input('items', sql.VarChar, items)
      .input('quantity', sql.Int, quantity)
      .input('priority', sql.VarChar, priority)
      .input('status', sql.VarChar, status)
      .input('date', sql.VarChar, date)
      .input('time', sql.VarChar, time)
      .query(`
        UPDATE cssd_requests
        SET department = @department,
            items = @items,
            quantity = @quantity,
            priority = @priority,
            status = @status,
            date = @date,
            time = @time
        WHERE id = @id
      `);

    res.json({ id, department, items, quantity, priority, status, date, time });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);

    const check = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM cssd_requests WHERE id = @id');

    if (check.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    await pool.request()
      .input('id', sql.VarChar, id)
      .query('DELETE FROM cssd_requests WHERE id = @id');

    res.json(check.recordset[0]);
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
