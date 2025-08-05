const { poolPromise } = require('./db');

async function checkAndUpdateConstraints() {
  try {
    const pool = await poolPromise;
    console.log('🔍 Checking database constraints...');
    
    // Check current constraints
    const constraintsResult = await pool.request().query(`
      SELECT 
        CONSTRAINT_NAME,
        CHECK_CLAUSE 
      FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS 
      WHERE CONSTRAINT_NAME LIKE '%department%' OR CONSTRAINT_NAME LIKE '%priority%'
    `);
    
    console.log('Current constraints:', constraintsResult.recordset);
    
    // Check what departments are currently in the table
    const departmentsResult = await pool.request().query(`
      SELECT DISTINCT crd_department FROM CSSD_request
    `);
    
    console.log('Current departments in table:', departmentsResult.recordset.map(d => d.crd_department));
    
    // Drop existing constraints if they exist
    console.log('🗑️  Dropping existing constraints...');
    await pool.request().query(`
      IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK__CSSD_requ__crd_d__786018FA')
        ALTER TABLE CSSD_request DROP CONSTRAINT CK__CSSD_requ__crd_d__786018FA
    `);
    
    await pool.request().query(`
      IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS WHERE CONSTRAINT_NAME = 'CK__CSSD_requ__crd_p__79543D33')
        ALTER TABLE CSSD_request DROP CONSTRAINT CK__CSSD_requ__crd_p__79543D33
    `);
    
    // Add new constraints that allow more departments
    console.log('✅ Adding new constraints...');
    await pool.request().query(`
      ALTER TABLE CSSD_request 
      ADD CONSTRAINT CK_crd_department 
      CHECK (crd_department IN ('Emergency', 'General Surgery', 'Orthopedics', 'Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Gynecology', 'ENT', 'Ophthalmology', 'Urology', 'Dermatology', 'Emergency Department', 'Intensive Care Unit', 'Operating Room', 'Radiology', 'Laboratory', 'Pharmacy', 'Physical Therapy', 'Outpatient Clinic'))
    `);
    
    await pool.request().query(`
      ALTER TABLE CSSD_request 
      ADD CONSTRAINT CK_crd_priority 
      CHECK (crd_priority IN ('High', 'Medium', 'Low'))
    `);
    
    console.log('✅ Constraints updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating constraints:', error.message);
  }
}

checkAndUpdateConstraints(); 