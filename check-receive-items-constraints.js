const { poolPromise } = require('./db');

async function checkReceiveItemsConstraints() {
  try {
    const pool = await poolPromise;
    console.log('🔍 Checking receive_items table constraints...');
    
    // Check constraints
    const constraintsResult = await pool.request().query(`
      SELECT CONSTRAINT_NAME, CHECK_CLAUSE 
      FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS 
      WHERE CONSTRAINT_NAME LIKE '%receive%' OR CONSTRAINT_NAME LIKE '%status%'
    `);
    
    console.log('📋 Current constraints:');
    constraintsResult.recordset.forEach(constraint => {
      console.log(`  ${constraint.CONSTRAINT_NAME}: ${constraint.CHECK_CLAUSE}`);
    });
    
    // Check what status values are currently in the table
    const statusResult = await pool.request().query('SELECT DISTINCT ri_status FROM receive_items');
    console.log('📋 Current status values in table:');
    statusResult.recordset.forEach(row => {
      console.log(`  ${row.ri_status}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking constraints:', error.message);
  }
}

checkReceiveItemsConstraints(); 