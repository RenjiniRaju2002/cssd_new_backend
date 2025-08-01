-- =============================================
-- Script: 00_create_CSSD_request_table.sql
-- Description: Creates the CSSD_request table if it does not exist.
-- =============================================

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CSSD_request')
      BEGIN 
        CREATE TABLE CSSD_request (
          crd_id_pk BIGINT IDENTITY(1,1) PRIMARY KEY,
          crd_department VARCHAR(100) CHECK (crd_department IN ('Cardiology', 'Neurology', 'Orthopedics', 'General Surgery', 'Emergency', 'ICU', 'Other')),
          crd_items VARCHAR(500) NOT NULL,
          crd_quantity BIGINT NOT NULL,
          crd_priority VARCHAR(20) CHECK (crd_priority IN ('High', 'Medium', 'Low')),
          crd_requested_by VARCHAR(100) NOT NULL,
          crd_request_on DATE NOT NULL,
          crd_time TIME NOT NULL,
          crd_default_status BIT DEFAULT 0,
          crd_status VARCHAR(50) CHECK (crd_status IN ('Requested', 'Approved', 'Rejected', 'In Progress', 'Completed', 'Cancelled')),
          crd_added_by VARCHAR(100),
          crd_added_on DATETIME DEFAULT GETDATE(),
          crd_modified_by VARCHAR(100),
          crd_modified_on DATETIME,
          crd_provider_fk BIGINT,
          crd_outlet_fk BIGINT
        );
        
        -- Create indexes for better performance
        CREATE INDEX IX_CSSD_request_department ON CSSD_request(crd_department);
        CREATE INDEX IX_CSSD_request_status ON CSSD_request(crd_status);
        CREATE INDEX IX_CSSD_request_date ON CSSD_request(crd_request_on);
        
        PRINT 'CSSD_request table created';
      END
      ELSE
      BEGIN
        PRINT 'CSSD_request table already exists';
      END


      