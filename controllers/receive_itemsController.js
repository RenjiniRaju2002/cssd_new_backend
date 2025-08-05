const { poolPromise, sql } = require('../db');

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM receive_items ORDER BY ri_id_pk DESC');
    
    // Transform the data to match frontend expectations
    const transformedData = result.recordset.map(row => ({
      id: `REC${row.ri_id_pk.toString().padStart(3, '0')}`,
      itemName: row.ri_item_name,
      quantity: row.ri_quantity,
      receivedDate: row.ri_received_date ? row.ri_received_date.toISOString().split('T')[0] : '',
      receivedTime: row.ri_received_time ? formatTime12Hour(row.ri_received_time) : '',
      supplier: row.ri_supplier || '',
      batchNumber: row.ri_batch_number || '',
      expiryDate: row.ri_expiry_date ? row.ri_expiry_date.toISOString().split('T')[0] : '',
      status: row.ri_status || 'Received',
      addedBy: row.ri_added_by || 'System'
    }));
    
    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching receive items:', error);
    res.status(500).json({ error: 'Failed to fetch receive items', details: error.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM receive_items WHERE ri_id_pk = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Receive item not found' });
    }

    const row = result.recordset[0];
    const transformedData = {
      id: `REC${row.ri_id_pk.toString().padStart(3, '0')}`,
      itemName: row.ri_item_name,
      quantity: row.ri_quantity,
      receivedDate: row.ri_received_date ? row.ri_received_date.toISOString().split('T')[0] : '',
      receivedTime: row.ri_received_time ? formatTime12Hour(row.ri_received_time) : '',
      supplier: row.ri_supplier || '',
      batchNumber: row.ri_batch_number || '',
      expiryDate: row.ri_expiry_date ? row.ri_expiry_date.toISOString().split('T')[0] : '',
      status: row.ri_status || 'Received',
      addedBy: row.ri_added_by || 'System'
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching receive item by ID:', error);
    res.status(500).json({ error: 'Failed to fetch receive item', details: error.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  const { itemName, quantity, supplier, batchNumber, expiryDate, status, addedBy } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('itemName', sql.VarChar, itemName)
      .input('quantity', sql.BigInt, quantity)
      .input('supplier', sql.VarChar, supplier)
      .input('batchNumber', sql.VarChar, batchNumber)
      .input('expiryDate', sql.Date, expiryDate)
      .input('status', sql.VarChar, status || 'Received')
      .input('addedBy', sql.VarChar, addedBy || 'System')
      .query(`
        INSERT INTO receive_items (ri_item_name, ri_quantity, ri_supplier, ri_batch_number, ri_expiry_date, ri_status, ri_added_by, ri_received_date, ri_received_time)
        VALUES (@itemName, @quantity, @supplier, @batchNumber, @expiryDate, @status, @addedBy, GETDATE(), CAST(GETDATE() AS TIME))
      `);

    res.status(201).json({ 
      message: 'Receive item created successfully',
      itemName, 
      quantity, 
      supplier, 
      batchNumber, 
      expiryDate, 
      status, 
      addedBy 
    });
  } catch (error) {
    console.error('Error creating receive item:', error);
    res.status(500).json({ error: 'Failed to create receive item', details: error.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  const { id } = req.params;
  const { itemName, quantity, supplier, batchNumber, expiryDate, status, addedBy } = req.body;

  try {
    const pool = await poolPromise;
    
    // Check if item exists
    const checkResult = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM receive_items WHERE ri_id_pk = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Receive item not found' });
    }

    // Update the item
    await pool.request()
      .input('id', sql.BigInt, id)
      .input('itemName', sql.VarChar, itemName)
      .input('quantity', sql.BigInt, quantity)
      .input('supplier', sql.VarChar, supplier)
      .input('batchNumber', sql.VarChar, batchNumber)
      .input('expiryDate', sql.Date, expiryDate)
      .input('status', sql.VarChar, status)
      .input('addedBy', sql.VarChar, addedBy)
      .query(`
        UPDATE receive_items
        SET ri_item_name = @itemName,
            ri_quantity = @quantity,
            ri_supplier = @supplier,
            ri_batch_number = @batchNumber,
            ri_expiry_date = @expiryDate,
            ri_status = @status,
            ri_added_by = @addedBy,
            ri_modified_on = GETDATE()
        WHERE ri_id_pk = @id
      `);

    res.json({ 
      message: 'Receive item updated successfully',
      id,
      itemName, 
      quantity, 
      supplier, 
      batchNumber, 
      expiryDate, 
      status, 
      addedBy 
    });
  } catch (error) {
    console.error('Error updating receive item:', error);
    res.status(500).json({ error: 'Failed to update receive item', details: error.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    // Check if item exists
    const checkResult = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM receive_items WHERE ri_id_pk = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Receive item not found' });
    }

    // Delete the item
    await pool.request()
      .input('id', sql.BigInt, id)
      .query('DELETE FROM receive_items WHERE ri_id_pk = @id');

    res.json({ 
      message: 'Receive item deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting receive item:', error);
    res.status(500).json({ error: 'Failed to delete receive item', details: error.message });
  }
};

// Helper function to format time in 12-hour format with AM/PM
function formatTime12Hour(timeValue) {
  if (!timeValue) return '';
  
  try {
    const date = new Date(timeValue);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } catch (e) {
    // Fallback to string manipulation if Date parsing fails
    const timeStr = timeValue.toString();
    if (timeStr.includes(':')) {
      const timeParts = timeStr.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } else {
      return timeStr.substring(0, 5);
    }
  }
} 