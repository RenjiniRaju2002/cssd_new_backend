const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const dbConfig = require('../db');





// const dbFilePath = path.join(__dirname, '../db.json');
// const db = require('../db.json');

// const availableItems = db['availableItems'] || [];

function saveDb() {
  db.availableItems = availableItems;
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

// GET ALL ITEMS
exports.getAll = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM availableItems');
    res.json(result.recordset);
    
  } catch (error) {
    console.error('Error fetching available items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET ITEM BY ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM availableItems WHERE ai_id_pk = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching available item by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// CREATE NEW ITEM
exports.create = async (req, res) => {
  const {
    id,
    name,
    category,
    availableQuantity,
    totalQuantity,
    unit,
    location,
    status = 'Available',
    addedBy = 'System'
  } = req.body;

  let pool;
  
  try {
    // 1. Save to MSSQL
    pool = await sql.connect(dbConfig);
    
    const request = pool.request();
    
    // Insert into MSSQL
    const result = await request
      .input('name', sql.VarChar, name)
      .input('category', sql.VarChar, category || null)
      .input('availableQuantity', sql.BigInt, parseInt(availableQuantity, 10) || 0)
      .input('totalQuantity', sql.BigInt, parseInt(totalQuantity, 10) || 0)
      .input('unit', sql.VarChar, unit || null)
      .input('location', sql.VarChar, location || null)
      .input('status', sql.VarChar, status)
      .input('addedBy', sql.VarChar, addedBy)
      .query(`
        INSERT INTO availableItems (
          ai_item_name,
          ai_category,
          ai_available_quantity,
          ai_total_quantity,
          ai_unit,
          ai_location,
          ai_status,
          ai_added_by
        )
        OUTPUT INSERTED.ai_id_pk
        VALUES (
          @name,
          @category,
          @availableQuantity,
          @totalQuantity,
          @unit,
          @location,
          @status,
          @addedBy
        )
      `);

    const newItemId = result.recordset[0].ai_id_pk;
    
    // 2. Also save to JSON file
    const newItem = {
      id: newItemId.toString(),
      name,
      category,
      availableQuantity: parseInt(availableQuantity, 10) || 0,
      totalQuantity: parseInt(totalQuantity, 10) || 0,
      unit: unit || null,
      location: location || null,
      status,
      lastUpdated: new Date().toISOString(),
      addedBy,
      addedOn: new Date().toISOString()
    };
    
    availableItems.push(newItem);
    saveDb();
    
    res.status(201).json({
      id: newItemId,
      ...newItem,
      message: 'Available item created successfully'
    });
    
  } catch (error) {
    console.error('Error creating available item:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
};

// UPDATE ITEM
exports.update = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    const pool = await sql.connect(dbConfig);
    
    // 1. Update in MSSQL
    const request = pool.request();
    let updateFields = [];
    
    // Build dynamic update query
    Object.keys(updates).forEach((key, index) => {
      const paramName = `param${index}`;
      const dbField = {
        'name': 'ai_item_name',
        'category': 'ai_category',
        'availableQuantity': 'ai_available_quantity',
        'totalQuantity': 'ai_total_quantity',
        'unit': 'ai_unit',
        'location': 'ai_location',
        'status': 'ai_status'
      }[key];
      
      if (dbField) {
        updateFields.push(`${dbField} = @${paramName}`);
        request.input(paramName, 
          key === 'availableQuantity' || key === 'totalQuantity' ? sql.BigInt : sql.VarChar, 
          updates[key]
        );
      }
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Add modified timestamp
    updateFields.push('ai_modified_on = GETDATE()');
    
    // Add ID parameter
    request.input('id', sql.Int, id);
    
    const query = `
      UPDATE availableItems 
      SET ${updateFields.join(', ')}
      WHERE ai_id_pk = @id
    `;
    
    const result = await request.query(query);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Available item not found' });
    }
    
    // 2. Update in JSON file
    const itemIndex = availableItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      availableItems[itemIndex] = { 
        ...availableItems[itemIndex], 
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      saveDb();
    }
    
    res.json({ 
      id,
      ...updates,
      message: 'Available item updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating available item:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
};

// DELETE ITEM
exports.remove = async (req, res) => {
  const { id } = req.params;
  
  try {
    const pool = await sql.connect(dbConfig);
    
    // 1. Delete from MSSQL
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM availableItems WHERE ai_id_pk = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Available item not found' });
    }
    
    // 2. Delete from JSON file
    const itemIndex = availableItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      const removed = availableItems.splice(itemIndex, 1);
      saveDb();
      return res.json(removed[0]);
    }
    
    res.status(404).json({ error: 'Available item not found in JSON store' });
    
  } catch (error) {
    console.error('Error deleting available item:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
};




