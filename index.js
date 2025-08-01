
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { poolPromise } = require('./db'); // ✅ Import MSSQL connection

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:8086', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CSSD API',
      version: '1.0.0',
      description: 'API documentation for CSSD backend',
    },
    servers: [
      { url: 'http://localhost:3001' }
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Register resource routes
app.use('/api/cssd_requests', require('./routes/cssd_requestsRoutes'));
app.use('/api/receive_items', require('./routes/receive_itemsRoutes'));
app.use('/api/stockItems', require('./routes/stockItemsRoutes'));
app.use('/api/sterilizationProcesses', require('./routes/sterilizationProcessesRoutes'));
app.use('/api/availableItems', require('./routes/availableItemsRoutes'));
app.use('/api/createdKits', require('./routes/createdKitsRoutes'));
app.use('/api/issueItems', require('./routes/issueItemsRoutes'));
app.use('/api/consumptionRecords', require('./routes/consumptionRecordsRoutes'));

app.get('/', (req, res) => {
  res.send('CSSD Backend API Running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 