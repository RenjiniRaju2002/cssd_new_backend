const { poolPromise, sql } = require('./db');

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    const pool = await poolPromise;
    console.log('✅ Database connection successful!');
    
    // Test query to get CSSD_request table data
    console.log('\n📊 Fetching CSSD_request table data...');
    const result = await pool.request().query('SELECT * FROM CSSD_request ORDER BY crd_request_on DESC, crd_time DESC');
    
    console.log(`✅ Found ${result.recordset.length} records in CSSD_request table`);
    
    if (result.recordset.length > 0) {
      console.log('\n📋 Sample data from CSSD_request table:');
      result.recordset.slice(0, 3).forEach((row, index) => {
        console.log(`\nRecord ${index + 1}:`);
        console.log(`  ID: ${row.crd_id_pk}`);
        console.log(`  Department: ${row.crd_department}`);
        console.log(`  Items: ${row.crd_items}`);
        console.log(`  Quantity: ${row.crd_quantity}`);
        console.log(`  Priority: ${row.crd_priority}`);
        console.log(`  Requested By: ${row.crd_requested_by}`);
        console.log(`  Status: ${row.crd_status}`);
        console.log(`  Date: ${row.crd_request_on}`);
        console.log(`  Time: ${row.crd_time}`);
      });
    } else {
      console.log('⚠️  No data found in CSSD_request table');
    }
    
    // Test table structure
    console.log('\n🔍 Checking table structure...');
    const structureResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'CSSD_request' 
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('📋 CSSD_request table structure:');
    structureResult.recordset.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE})`);
    });
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the test
testDatabaseConnection(); 