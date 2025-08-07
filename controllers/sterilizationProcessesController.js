const sql = require('mssql');
const { dbConfig, poolPromise } = require('../db');

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM sterilizationProcesses');
    
    // Map database field names to frontend field names
    const mappedData = result.recordset.map(record => ({
      id: record.sp_id_pk,
      processName: record.sp_process_name || '',
      items: record.sp_items || '',
      quantity: record.sp_quantity || 0,
      processType: record.sp_process_type || '',
      startTime: record.sp_start_time || '',
      endTime: record.sp_end_time || '',
      temperature: record.sp_temperature || 0,
      pressure: record.sp_pressure || 0,
      status: record.sp_status || 'In Progress',
      operator: record.sp_operator || '',
      notes: record.sp_notes || '',
      addedBy: record.sp_added_by || '',
      addedOn: record.sp_added_on,
      modifiedBy: record.sp_modified_by || '',
      modifiedOn: record.sp_modified_on,
      providerFk: record.sp_provider_fk,
      outletFk: record.sp_outlet_fk,
      itemId: record.item_id || '', // CSSD request item ID
      // Keep original database fields for backend compatibility
      sp_id_pk: record.sp_id_pk,
      sp_process_name: record.sp_process_name,
      sp_items: record.sp_items,
      sp_quantity: record.sp_quantity,
      sp_process_type: record.sp_process_type,
      sp_start_time: record.sp_start_time,
      sp_end_time: record.sp_end_time,
      sp_temperature: record.sp_temperature,
      sp_pressure: record.sp_pressure,
      sp_status: record.sp_status,
      sp_operator: record.sp_operator,
      sp_notes: record.sp_notes,
      sp_added_by: record.sp_added_by,
      sp_added_on: record.sp_added_on,
      sp_modified_by: record.sp_modified_by,
      sp_modified_on: record.sp_modified_on,
      sp_provider_fk: record.sp_provider_fk,
      sp_outlet_fk: record.sp_outlet_fk
    }));
    
    res.json(mappedData);
  } catch (err) {
    console.error('Error fetching sterilization processes:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('sp_id_pk', sql.VarChar, req.params.id)
      .query('SELECT * FROM sterilizationProcesses WHERE sp_id_pk = @sp_id_pk');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  const {
    id,
    processName,
    items,
    quantity,
    processType,
    startTime,
    endTime,
    temperature,
    pressure,
    status,
    operator,
    notes,
    addedBy,
    providerFk,
    outletFk,
    itemId, // CSSD request item ID
    // Support legacy frontend field names
    machine,
    process,
    duration
  } = req.body;

  try {
    const pool = await poolPromise;
    
    // Generate unique ID if not provided
    const processId = id || `SP${Date.now()}`;
    const currentDateTime = new Date();
    
    // Map frontend field names to database field names
    const processData = {
      sp_process_name: processName || process || machine || 'Sterilization Process',
      sp_items: items || 'Medical Instruments',
      sp_quantity: quantity || 1,
      sp_process_type: processType || 'Steam Sterilization',
      sp_start_time: startTime || currentDateTime.toLocaleTimeString('en-IN', { hour12: false }),
      sp_end_time: endTime || null,
      sp_temperature: temperature || null,
      sp_pressure: pressure || null,
      sp_status: status || 'In Progress',
      sp_operator: operator || 'System',
      sp_notes: notes || '',
      sp_added_by: addedBy || operator || 'System',
      sp_added_on: currentDateTime,
      sp_modified_by: null,
      sp_modified_on: null,
      sp_provider_fk: providerFk || null,
      sp_outlet_fk: outletFk || null,
      item_id: itemId || null // CSSD request item ID reference
    };
    
    const result = await pool.request()
      .input('sp_process_name', sql.VarChar, processData.sp_process_name)
      .input('sp_items', sql.VarChar, processData.sp_items)
      .input('sp_quantity', sql.Int, processData.sp_quantity)
      .input('sp_process_type', sql.VarChar, processData.sp_process_type)
      .input('sp_start_time', sql.VarChar, processData.sp_start_time)
      .input('sp_end_time', sql.VarChar, processData.sp_end_time)
      .input('sp_temperature', sql.Float, processData.sp_temperature)
      .input('sp_pressure', sql.Float, processData.sp_pressure)
      .input('sp_status', sql.VarChar, processData.sp_status)
      .input('sp_operator', sql.VarChar, processData.sp_operator)
      .input('sp_notes', sql.Text, processData.sp_notes)
      .input('sp_added_by', sql.VarChar, processData.sp_added_by)
      .input('sp_added_on', sql.DateTime, processData.sp_added_on)
      .input('sp_modified_by', sql.VarChar, processData.sp_modified_by)
      .input('sp_modified_on', sql.DateTime, processData.sp_modified_on)
      .input('sp_provider_fk', sql.BigInt, processData.sp_provider_fk)
      .input('sp_outlet_fk', sql.BigInt, processData.sp_outlet_fk)
      .input('item_id', sql.BigInt, processData.item_id)
      .query(`
        INSERT INTO sterilizationProcesses (
          sp_process_name, sp_items, sp_quantity, sp_process_type,
          sp_start_time, sp_end_time, sp_temperature, sp_pressure, sp_status,
          sp_operator, sp_notes, sp_added_by, sp_added_on, sp_modified_by,
          sp_modified_on, sp_provider_fk, sp_outlet_fk, item_id
        )
        VALUES (
          @sp_process_name, @sp_items, @sp_quantity, @sp_process_type,
          @sp_start_time, @sp_end_time, @sp_temperature, @sp_pressure, @sp_status,
          @sp_operator, @sp_notes, @sp_added_by, @sp_added_on, @sp_modified_by,
          @sp_modified_on, @sp_provider_fk, @sp_outlet_fk, @item_id
        )
      `);

    res.status(201).json({ 
      message: 'Sterilization process created successfully', 
      data: {
        processName: processData.sp_process_name,
        items: processData.sp_items,
        quantity: processData.sp_quantity,
        processType: processData.sp_process_type,
        startTime: processData.sp_start_time,
        status: processData.sp_status,
        operator: processData.sp_operator,
        itemId: processData.item_id
      }
    });
  } catch (err) {
    console.error('Error creating sterilization process:', err);
    res.status(500).json({ error: err.message, details: err });
  }
};


// UPDATE
exports.update = async (req, res) => {
  const sp_id_pk = req.params.id;
  const {
    processName,
    items,
    quantity,
    processType,
    startTime,
    endTime,
    temperature,
    pressure,
    status,
    operator,
    notes,
    modifiedBy,
    providerFk,
    outletFk,
    // Support legacy frontend field names
    machine,
    process,
    itemId,
    duration,
    // Backend field name compatibility
    sp_process_name,
    sp_items,
    sp_quantity,
    sp_process_type,
    sp_start_time,
    sp_end_time,
    sp_temperature,
    sp_pressure,
    sp_status,
    sp_operator,
    sp_notes,
    sp_modified_by,
    sp_provider_fk,
    sp_outlet_fk
  } = req.body;

  try {
    const pool = await poolPromise;
    
    // Build dynamic update query based on provided fields
    let updateFields = [];
    let inputs = [];
    
    // Add modified timestamp and user
    updateFields.push('sp_modified_on = @sp_modified_on');
    inputs.push({ name: 'sp_modified_on', type: sql.DateTime, value: new Date() });
    
    if (processName || process || machine || sp_process_name) {
      updateFields.push('sp_process_name = @sp_process_name');
      inputs.push({ name: 'sp_process_name', type: sql.VarChar, value: processName || process || machine || sp_process_name });
    }
    
    if (items || itemId || sp_items) {
      updateFields.push('sp_items = @sp_items');
      inputs.push({ name: 'sp_items', type: sql.VarChar, value: items || itemId || sp_items });
    }
    
    if (quantity !== undefined || sp_quantity !== undefined) {
      updateFields.push('sp_quantity = @sp_quantity');
      inputs.push({ name: 'sp_quantity', type: sql.Int, value: quantity || sp_quantity });
    }
    
    if (processType || sp_process_type) {
      updateFields.push('sp_process_type = @sp_process_type');
      inputs.push({ name: 'sp_process_type', type: sql.VarChar, value: processType || sp_process_type });
    }
    
    if (startTime || sp_start_time) {
      updateFields.push('sp_start_time = @sp_start_time');
      inputs.push({ name: 'sp_start_time', type: sql.VarChar, value: startTime || sp_start_time });
    }
    
    if (endTime || sp_end_time) {
      updateFields.push('sp_end_time = @sp_end_time');
      inputs.push({ name: 'sp_end_time', type: sql.VarChar, value: endTime || sp_end_time });
    }
    
    if (temperature !== undefined || sp_temperature !== undefined) {
      updateFields.push('sp_temperature = @sp_temperature');
      inputs.push({ name: 'sp_temperature', type: sql.Float, value: temperature || sp_temperature });
    }
    
    if (pressure !== undefined || sp_pressure !== undefined) {
      updateFields.push('sp_pressure = @sp_pressure');
      inputs.push({ name: 'sp_pressure', type: sql.Float, value: pressure || sp_pressure });
    }
    
    if (status || sp_status) {
      updateFields.push('sp_status = @sp_status');
      inputs.push({ name: 'sp_status', type: sql.VarChar, value: status || sp_status });
    }
    
    if (operator || sp_operator) {
      updateFields.push('sp_operator = @sp_operator');
      inputs.push({ name: 'sp_operator', type: sql.VarChar, value: operator || sp_operator });
    }
    
    if (notes !== undefined || sp_notes !== undefined) {
      updateFields.push('sp_notes = @sp_notes');
      inputs.push({ name: 'sp_notes', type: sql.Text, value: notes || sp_notes || '' });
    }
    
    if (modifiedBy || sp_modified_by) {
      updateFields.push('sp_modified_by = @sp_modified_by');
      inputs.push({ name: 'sp_modified_by', type: sql.VarChar, value: modifiedBy || sp_modified_by });
    }
    
    if (providerFk !== undefined || sp_provider_fk !== undefined) {
      updateFields.push('sp_provider_fk = @sp_provider_fk');
      inputs.push({ name: 'sp_provider_fk', type: sql.BigInt, value: providerFk || sp_provider_fk });
    }
    
    if (outletFk !== undefined || sp_outlet_fk !== undefined) {
      updateFields.push('sp_outlet_fk = @sp_outlet_fk');
      inputs.push({ name: 'sp_outlet_fk', type: sql.BigInt, value: outletFk || sp_outlet_fk });
    }
    
    if (itemId) {
      updateFields.push('item_id = @item_id');
      inputs.push({ name: 'item_id', type: sql.BigInt, value: itemId });
    }
    
    if (updateFields.length === 1) { // Only sp_modified_on was added
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const request = pool.request().input('sp_id_pk', sql.VarChar, sp_id_pk);
    
    // Add all dynamic inputs
    inputs.forEach(input => {
      request.input(input.name, input.type, input.value);
    });
    
    const query = `UPDATE sterilizationProcesses SET ${updateFields.join(', ')} WHERE sp_id_pk = @sp_id_pk`;
    
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ message: 'Sterilization process updated successfully' });
  } catch (err) {
    console.error('Error updating sterilization process:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('DELETE FROM sterilizationProcesses WHERE sp_id_pk = @id'); // FIXED

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

