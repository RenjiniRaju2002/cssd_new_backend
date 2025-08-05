const { poolPromise } = require('./db');

async function testTimeFormat() {
  try {
    const pool = await poolPromise;
    console.log('🔍 Testing time format from database...');
    
    const result = await pool.request().query('SELECT TOP 3 crd_id_pk, crd_time, crd_request_on FROM CSSD_request');
    
    console.log('📋 Sample time data:');
    result.recordset.forEach((row, index) => {
      console.log(`\nRecord ${index + 1}:`);
      console.log(`  ID: ${row.crd_id_pk}`);
      console.log(`  crd_time type: ${typeof row.crd_time}`);
      console.log(`  crd_time value: ${row.crd_time}`);
      console.log(`  crd_time toString(): ${row.crd_time.toString()}`);
      console.log(`  crd_request_on: ${row.crd_request_on}`);
      
      // Try different time formatting approaches
      const timeStr = row.crd_time.toString();
      console.log(`  Raw time string: "${timeStr}"`);
      console.log(`  Length: ${timeStr.length}`);
      console.log(`  First 5 chars: "${timeStr.substring(0, 5)}"`);
      
      if (timeStr.includes(':')) {
        console.log(`  Contains colon: true`);
        console.log(`  HH:MM format: ${timeStr.substring(0, 5)}`);
      }
      
      if (timeStr.includes('T')) {
        console.log(`  Contains T: true`);
        console.log(`  ISO format: ${timeStr.split('T')[1].substring(0, 5)}`);
      }
      
      try {
        const date = new Date(row.crd_time);
        console.log(`  Date object: ${date}`);
        console.log(`  toTimeString(): ${date.toTimeString()}`);
        console.log(`  toTimeString().substring(0,5): ${date.toTimeString().substring(0, 5)}`);
      } catch (e) {
        console.log(`  Date parsing failed: ${e.message}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing time format:', error.message);
  }
}

testTimeFormat(); 