const { poolPromise, sql } = require('../db');

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM createdKits ORDER BY ck_id_pk DESC');
    
    // Transform the data to match frontend expectations
    const transformedData = result.recordset.map(row => ({
      id: `KIT${row.ck_id_pk.toString().padStart(3, '0')}`,
      name: row.ck_kit_name,
      department: row.ck_kit_type || 'General',
      items: row.ck_items,
      quantity: row.ck_quantity,
      priority: 'Medium', // Default priority since it's not in the table
      requestedBy: row.ck_created_by || 'System',
      status: row.ck_status || 'Active',
      date: row.ck_created_date ? row.ck_created_date.toISOString().split('T')[0] : '',
      time: row.ck_created_time ? formatTime12Hour(row.ck_created_time) : ''
    }));
    
    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching created kits:', error);
    res.status(500).json({ error: 'Failed to fetch created kits', details: error.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM createdKits WHERE ck_id_pk = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Kit not found' });
    }

    const row = result.recordset[0];
    const transformedData = {
      id: `KIT${row.ck_id_pk.toString().padStart(3, '0')}`,
      name: row.ck_kit_name,
      department: row.ck_kit_type || 'General',
      items: row.ck_items,
      quantity: row.ck_quantity,
      priority: 'Medium', // Default priority since it's not in the table
      requestedBy: row.ck_created_by || 'System',
      status: row.ck_status || 'Active',
      date: row.ck_created_date ? row.ck_created_date.toISOString().split('T')[0] : '',
      time: row.ck_created_time ? formatTime12Hour(row.ck_created_time) : ''
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching kit by ID:', error);
    res.status(500).json({ error: 'Failed to fetch kit', details: error.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  const { name, department, items, quantity, priority, requestedBy, status } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('department', sql.VarChar, department)
      .input('items', sql.VarChar, items)
      .input('quantity', sql.BigInt, quantity)
      .input('requestedBy', sql.VarChar, requestedBy)
      .input('status', sql.VarChar, status || 'Active')
      .query(`
        INSERT INTO createdKits (ck_kit_name, ck_kit_type, ck_items, ck_quantity, ck_created_by, ck_status, ck_created_date, ck_created_time)
        VALUES (@name, @department, @items, @quantity, @requestedBy, @status, GETDATE(), CAST(GETDATE() AS TIME))
      `);

    res.status(201).json({ 
      message: 'Kit created successfully',
      name, 
      department, 
      items, 
      quantity, 
      priority, 
      requestedBy, 
      status 
    });
  } catch (error) {
    console.error('Error creating kit:', error);
    res.status(500).json({ error: 'Failed to create kit', details: error.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, department, items, quantity, priority, requestedBy, status } = req.body;

  try {
    const pool = await poolPromise;
    
    // Check if kit exists
    const checkResult = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM createdKits WHERE kit_id_pk = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Kit not found' });
    }

    // Update the kit
    await pool.request()
      .input('id', sql.BigInt, id)
      .input('name', sql.VarChar, name)
      .input('department', sql.VarChar, department)
      .input('items', sql.VarChar, items)
      .input('quantity', sql.BigInt, quantity)
      .input('priority', sql.VarChar, priority)
      .input('requestedBy', sql.VarChar, requestedBy)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE createdKits
        SET kit_name = @name,
            kit_department = @department,
            kit_items = @items,
            kit_quantity = @quantity,
            kit_priority = @priority,
            kit_requested_by = @requestedBy,
            kit_status = @status,
            kit_modified_on = GETDATE()
        WHERE kit_id_pk = @id
      `);

    res.json({ 
      message: 'Kit updated successfully',
      id,
      name, 
      department, 
      items, 
      quantity, 
      priority, 
      requestedBy, 
      status 
    });
  } catch (error) {
    console.error('Error updating kit:', error);
    res.status(500).json({ error: 'Failed to update kit', details: error.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    // Check if kit exists
    const checkResult = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM createdKits WHERE kit_id_pk = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Kit not found' });
    }

    // Delete the kit
    await pool.request()
      .input('id', sql.BigInt, id)
      .query('DELETE FROM createdKits WHERE kit_id_pk = @id');

    res.json({ 
      message: 'Kit deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting kit:', error);
    res.status(500).json({ error: 'Failed to delete kit', details: error.message });
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