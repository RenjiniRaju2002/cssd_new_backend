// const fs = require('fs');
// const path = require('path');
// const dbFilePath = path.join(__dirname, '../db.json');
// const db = require('../db.json');

// const availableItems = db['availableItems'];

// function saveDb() {
//   fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
// }

// exports.getAll = (req, res) => {
//   res.json(availableItems);
// };

// exports.getById = (req, res) => {
//   const item = availableItems.find(i => i.id === req.params.id);
//   if (!item) return res.status(404).json({ error: 'Not found' });
//   res.json(item);
// };

// exports.create = (req, res) => {
//   const item = req.body;
//   availableItems.push(item);
//   saveDb();
//   res.status(201).json(item);
// };

// exports.update = (req, res) => {
//   const idx = availableItems.findIndex(i => i.id === req.params.id);
//   if (idx === -1) return res.status(404).json({ error: 'Not found' });
//   availableItems[idx] = { ...availableItems[idx], ...req.body };
//   saveDb();
//   res.json(availableItems[idx]);
// };

// exports.remove = (req, res) => {
//   const idx = availableItems.findIndex(i => i.id === req.params.id);
//   if (idx === -1) return res.status(404).json({ error: 'Not found' });
//   const removed = availableItems.splice(idx, 1);
//   saveDb();
//   res.json(removed[0]);
// };



const sql = require('mssql');
const dbConfig = require('../db'); // assumes you’ve set this up

// GET ALL ITEMS
exports.getAll = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM availableItems');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET ITEM BY ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM availableItems WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// CREATE NEW ITEM
exports.create = async (req, res) => {
  const { id, name, quantity } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.VarChar, id)
      .input('name', sql.VarChar, name)
      .input('quantity', sql.Int, quantity)
      .query('INSERT INTO availableItems (id, name, quantity) VALUES (@id, @name, @quantity)');

    res.status(201).json({ id, name, quantity });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// UPDATE ITEM
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM availableItems WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    await pool.request()
      .input('id', sql.VarChar, id)
      .input('name', sql.VarChar, name)
      .input('quantity', sql.Int, quantity)
      .query('UPDATE availableItems SET name = @name, quantity = @quantity WHERE id = @id');

    res.json({ id, name, quantity });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE ITEM
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM availableItems WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    await pool.request()
      .input('id', sql.VarChar, id)
      .query('DELETE FROM availableItems WHERE id = @id');

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
