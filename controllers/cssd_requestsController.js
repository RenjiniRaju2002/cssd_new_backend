const { poolPromise, sql } = require('../db');

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM CSSD_request ORDER BY crd_id_pk DESC');
    
    // Transform the data to match frontend expectations
    const transformedData = result.recordset.map(row => {
      // Format time properly in 12-hour format with AM/PM
      let formattedTime = '';
      if (row.crd_time) {
        try {
          const date = new Date(row.crd_time);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12; // Convert 0 to 12
          formattedTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        } catch (e) {
          // Fallback to string manipulation if Date parsing fails
          const timeStr = row.crd_time.toString();
          if (timeStr.includes(':')) {
            const timeParts = timeStr.split(':');
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            formattedTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
          } else {
            formattedTime = timeStr.substring(0, 5);
          }
        }
      }
      
      return {
        id: `REQ${row.crd_id_pk.toString().padStart(3, '0')}`,
        crd_id_pk: row.crd_id_pk, // Include the actual database ID for foreign key references
        department: row.crd_department,
        items: row.crd_items,
        quantity: row.crd_quantity,
        priority: row.crd_priority,
        requestedBy: row.crd_requested_by,
        status: row.crd_status,
        date: row.crd_request_on ? row.crd_request_on.toISOString().split('T')[0] : '',
        time: formattedTime
      };
    });
    
    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching CSSD requests:', error);
    res.status(500).json({ error: 'Failed to fetch CSSD requests', details: error.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM CSSD_request WHERE crd_id_pk = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const row = result.recordset[0];
    
    // Format time properly in 12-hour format with AM/PM
    let formattedTime = '';
    if (row.crd_time) {
      try {
        const date = new Date(row.crd_time);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12; // Convert 0 to 12
        formattedTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      } catch (e) {
        // Fallback to string manipulation if Date parsing fails
        const timeStr = row.crd_time.toString();
        if (timeStr.includes(':')) {
          const timeParts = timeStr.split(':');
          const hours = parseInt(timeParts[0]);
          const minutes = parseInt(timeParts[1]);
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          formattedTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        } else {
          formattedTime = timeStr.substring(0, 5);
        }
      }
    }
    
    const transformedData = {
      id: `REQ${row.crd_id_pk.toString().padStart(3, '0')}`,
      crd_id_pk: row.crd_id_pk, // Include the actual database ID for foreign key references
      department: row.crd_department,
      items: row.crd_items,
      quantity: row.crd_quantity,
      priority: row.crd_priority,
      requestedBy: row.crd_requested_by,
      status: row.crd_status,
      date: row.crd_request_on ? row.crd_request_on.toISOString().split('T')[0] : '',
      time: formattedTime
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    res.status(500).json({ error: 'Failed to fetch request', details: error.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  const { department, items, quantity, priority, requestedBy, status } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('department', sql.VarChar, department)
      .input('items', sql.VarChar, items)
      .input('quantity', sql.BigInt, quantity)
      .input('priority', sql.VarChar, priority)
      .input('requestedBy', sql.VarChar, requestedBy)
      .input('status', sql.VarChar, status || 'Requested')
      .query(`
        INSERT INTO CSSD_request (crd_department, crd_items, crd_quantity, crd_priority, crd_requested_by, crd_status, crd_request_on, crd_time)
        VALUES (@department, @items, @quantity, @priority, @requestedBy, @status, GETDATE(), CAST(GETDATE() AS TIME))
      `);

    res.status(201).json({ 
      message: 'Request created successfully',
      department, 
      items, 
      quantity, 
      priority, 
      requestedBy, 
      status 
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request', details: error.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  const { id } = req.params;
  const { department, items, quantity, priority, requestedBy, status } = req.body;

  try {
    const pool = await poolPromise;
    
    // Check if request exists
    const checkResult = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM CSSD_request WHERE crd_id_pk = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update the request
    await pool.request()
      .input('id', sql.BigInt, id)
      .input('department', sql.VarChar, department)
      .input('items', sql.VarChar, items)
      .input('quantity', sql.BigInt, quantity)
      .input('priority', sql.VarChar, priority)
      .input('requestedBy', sql.VarChar, requestedBy)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE CSSD_request
        SET crd_department = @department,
            crd_items = @items,
            crd_quantity = @quantity,
            crd_priority = @priority,
            crd_requested_by = @requestedBy,
            crd_status = @status,
            crd_modified_on = GETDATE()
        WHERE crd_id_pk = @id
      `);

    res.json({ 
      message: 'Request updated successfully',
      id,
      department, 
      items, 
      quantity, 
      priority, 
      requestedBy, 
      status 
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Failed to update request', details: error.message });
  }
};

// APPROVE REQUEST
exports.approve = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    
    // Check if request exists
    const checkResult = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM CSSD_request WHERE crd_id_pk = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update the request status to approved
    await pool.request()
      .input('id', sql.BigInt, id)
      .query(`
        UPDATE CSSD_request
        SET crd_status = 'Approved',
            crd_modified_on = GETDATE()
        WHERE crd_id_pk = @id
      `);

    res.json({ 
      message: 'Request approved successfully',
      id,
      status: 'Approved'
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ error: 'Failed to approve request', details: error.message });
  }
};

// REJECT REQUEST
exports.reject = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    
    // Check if request exists
    const checkResult = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM CSSD_request WHERE crd_id_pk = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update the request status to rejected
    await pool.request()
      .input('id', sql.BigInt, id)
      .query(`
        UPDATE CSSD_request
        SET crd_status = 'Rejected',
            crd_modified_on = GETDATE()
        WHERE crd_id_pk = @id
      `);

    res.json({ 
      message: 'Request rejected successfully',
      id,
      status: 'Rejected'
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Failed to reject request', details: error.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    // Check if request exists
    const checkResult = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM CSSD_request WHERE crd_id_pk = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Delete the request
    await pool.request()
      .input('id', sql.BigInt, id)
      .query('DELETE FROM CSSD_request WHERE crd_id_pk = @id');

    res.json({ 
      message: 'Request deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Failed to delete request', details: error.message });
  }
};
