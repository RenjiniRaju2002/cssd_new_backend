const { poolPromise } = require('./db');

async function createKitsTable() {
  try {
    const pool = await poolPromise;
    console.log('🔍 Creating createdKits table...');
    
    const createTableSQL = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'createdKits')
      BEGIN
        CREATE TABLE createdKits (
          kit_id_pk BIGINT IDENTITY(1,1) PRIMARY KEY,
          kit_name VARCHAR(255) NOT NULL,
          kit_department VARCHAR(100) NOT NULL,
          kit_items TEXT,
          kit_quantity BIGINT NOT NULL,
          kit_priority VARCHAR(20) NOT NULL,
          kit_requested_by VARCHAR(100),
          kit_status VARCHAR(50) DEFAULT 'Active',
          kit_created_on DATETIME DEFAULT GETDATE(),
          kit_created_time TIME DEFAULT CAST(GETDATE() AS TIME),
          kit_modified_on DATETIME,
          kit_modified_by VARCHAR(100),
          kit_provider_fk BIGINT,
          kit_outlet_fk BIGINT,
          CONSTRAINT CK_kit_department CHECK (kit_department IN ('Emergency', 'General Surgery', 'Orthopedics', 'Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Gynecology', 'ENT', 'Ophthalmology', 'Urology', 'Dermatology', 'Emergency Department', 'Intensive Care Unit', 'Operating Room', 'Radiology', 'Laboratory', 'Pharmacy', 'Physical Therapy', 'Outpatient Clinic')),
          CONSTRAINT CK_kit_priority CHECK (kit_priority IN ('High', 'Medium', 'Low')),
          CONSTRAINT CK_kit_status CHECK (kit_status IN ('Active', 'Inactive', 'Pending', 'Completed'))
        );
        PRINT 'createdKits table created successfully';
      END
      ELSE
      BEGIN
        PRINT 'createdKits table already exists';
      END
    `;
    
    await pool.request().query(createTableSQL);
    console.log('✅ createdKits table created or already exists');
    
    // Check if table has data
    const checkData = await pool.request().query('SELECT COUNT(*) as count FROM createdKits');
    console.log(`📊 createdKits table has ${checkData.recordset[0].count} records`);
    
  } catch (error) {
    console.error('❌ Error creating createdKits table:', error.message);
  }
}

createKitsTable(); 