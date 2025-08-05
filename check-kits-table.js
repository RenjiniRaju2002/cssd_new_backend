const { poolPromise } = require('./db');

async function checkKitsTable() {
  try {
    const pool = await poolPromise;
    console.log('🔍 Checking createdKits table structure...');
    
    // Check table structure
    const structureResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'createdKits' 
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('📋 createdKits table structure:');
    structureResult.recordset.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE})`);
    });
    
    // Check if table exists and has data
    const dataResult = await pool.request().query('SELECT COUNT(*) as count FROM createdKits');
    console.log(`📊 createdKits table has ${dataResult.recordset[0].count} records`);
    
    if (dataResult.recordset[0].count > 0) {
      const sampleData = await pool.request().query('SELECT TOP 3 * FROM createdKits');
      console.log('📋 Sample data:');
      sampleData.recordset.forEach((row, index) => {
        console.log(`\nRecord ${index + 1}:`);
        Object.keys(row).forEach(key => {
          console.log(`  ${key}: ${row[key]}`);
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking createdKits table:', error.message);
  }
}

checkKitsTable(); 