const { poolPromise } = require('./db');

async function checkReceiveItemsTable() {
  try {
    const pool = await poolPromise;
    console.log('🔍 Checking receive_items table structure...');
    
    // Check table structure
    const structureResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'receive_items' 
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('📋 receive_items table structure:');
    structureResult.recordset.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE})`);
    });
    
    // Check if table exists and has data
    const dataResult = await pool.request().query('SELECT COUNT(*) as count FROM receive_items');
    console.log(`📊 receive_items table has ${dataResult.recordset[0].count} records`);
    
    if (dataResult.recordset[0].count > 0) {
      const sampleData = await pool.request().query('SELECT TOP 3 * FROM receive_items');
      console.log('📋 Sample data:');
      sampleData.recordset.forEach((row, index) => {
        console.log(`\nRecord ${index + 1}:`);
        Object.keys(row).forEach(key => {
          console.log(`  ${key}: ${row[key]}`);
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking receive_items table:', error.message);
  }
}

checkReceiveItemsTable(); 