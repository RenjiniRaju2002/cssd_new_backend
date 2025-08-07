const express = require('express');
const router = express.Router();
const controller = require('../controllers/sterilizationProcessesController');

/**
 * @swagger
 * components:
 *   schemas:
 *     SterilizationProcess:
 *       type: object
 *       required:
 *         - id
 *         - machine
 *         - process
 *         - itemId
 *         - startTime
 *         - endTime
 *         - status
 *         - duration
 *       properties:
 *         id:
 *           type: string
 *         machine:
 *           type: string
 *         process:
 *           type: string
 *         itemId:
 *           type: string
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *         status:
 *           type: string
 *         duration:
 *           type: number
 *       example:
 *         id: 'STE001'
 *         machine: 'Autoclave-2'
 *         process: 'Chemical Sterilization'
 *         itemId: 'REQ002'
 *         startTime: '13:54'
 *         endTime: '13:59'
 *         status: 'Completed'
 *         duration: 75
 */

/**
 * @swagger
 * tags:
 *   name: SterilizationProcesses
 *   description: Sterilization process management
 */

/**
 * @swagger
 * /sterilizationProcesses:
 *   get:
 *     summary: Get all sterilization processes
 *     tags: [SterilizationProcesses]
 *     responses:
 *       200:
 *         description: List of sterilization processes
 *   post:
 *     summary: Create a new sterilization process
 *     tags: [SterilizationProcesses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SterilizationProcess'
 *     responses:
 *       201:
 *         description: Created
 */

/**
 * @swagger
 * /sterilizationProcesses/{id}:
 *   get:
 *     summary: Get a sterilization process by ID
 *     tags: [SterilizationProcesses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Process ID
 *     responses:
 *       200:
 *         description: Sterilization process
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a sterilization process
 *     tags: [SterilizationProcesses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Process ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SterilizationProcess'
 *     responses:
 *       200:
 *         description: Sterilization process found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SterilizationProcess'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a sterilization process
 *     tags: [SterilizationProcesses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Process ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
*/


router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.patch('/:id', controller.update); // Add PATCH route for frontend compatibility
router.delete('/:id', controller.remove);

module.exports = router; 