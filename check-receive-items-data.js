const { poolPromise } = require('./db');

async function checkReceiveItemsData() {
  try {
    const pool = await poolPromise;
    console.log('🔍 Checking receive_items table data...');
    
    // Check current data
    const dataResult = await pool.request().query('SELECT COUNT(*) as count FROM receive_items');
    console.log(`📊 receive_items table has ${dataResult.recordset[0].count} records`);
    
    if (dataResult.recordset[0].count > 0) {
      const sampleData = await pool.request().query('SELECT TOP 5 * FROM receive_items ORDER BY ri_id_pk DESC');
      console.log('📋 Recent receive_items data:');
      sampleData.recordset.forEach((row, index) => {
        console.log(`\nRecord ${index + 1}:`);
        console.log(`  ID: ${row.ri_id_pk}`);
        console.log(`  Item Name: ${row.ri_item_name}`);
        console.log(`  Quantity: ${row.ri_quantity}`);
        console.log(`  Received Date: ${row.ri_received_date}`);
        console.log(`  Received Time: ${row.ri_received_time}`);
        console.log(`  Supplier: ${row.ri_supplier}`);
        console.log(`  Batch Number: ${row.ri_batch_number}`);
        console.log(`  Expiry Date: ${row.ri_expiry_date}`);
        console.log(`  Status: ${row.ri_status}`);
        console.log(`  Added By: ${row.ri_added_by}`);
      });
    } else {
      console.log('⚠️  No data found in receive_items table');
    }
    
  } catch (error) {
    console.error('❌ Error checking receive_items data:', error.message);
  }
}

checkReceiveItemsData(); 