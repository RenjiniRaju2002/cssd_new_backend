const express = require('express');
const router = express.Router();
const controller = require('../controllers/consumptionRecordsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     ConsumptionRecord:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - dept
 *         - date
 *         - before
 *         - after
 *         - used
 *         - items
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *         dept:
 *           type: string
 *         date:
 *           type: string
 *         before:
 *           type: number
 *         after:
 *           type: number
 *         used:
 *           type: number
 *         items:
 *           type: string
 *         requestId:
 *           type: string
 *         kitId:
 *           type: string
 *       example:
 *         id: 'SURG001'
 *         type: 'Hip replacement'
 *         dept: 'OR-3'
 *         date: '2025-07-05'
 *         before: 7
 *         after: 4
 *         used: 3
 *         items: '3'
 *         requestId: 'REQ002'
 *         kitId: ''
 */

/**
 * @swagger
 * tags:
 *   name: ConsumptionRecords
 *   description: Consumption records management
 */

/**
 * @swagger
 * /consumptionRecords:
 *   get:
 *     summary: Get all consumption records
 *     tags: [ConsumptionRecords]
 *     responses:
 *       200:
 *         description: List of consumption records
 *   post:
 *     summary: Add a new consumption record
 *     tags: [ConsumptionRecords]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConsumptionRecord'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', controller.getAll);
router.post('/', controller.create);

/**
 * @swagger
 * /consumptionRecords/{id}:
 *   get:
 *     summary: Get a consumption record by ID
 *     tags: [ConsumptionRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Consumption record
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a consumption record
 *     tags: [ConsumptionRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConsumptionRecord'
 *     responses:
 *       200:
 *         description: Consumption record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsumptionRecord'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a consumption record
 *     tags: [ConsumptionRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router; 