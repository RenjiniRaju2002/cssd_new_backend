const express = require('express');
const router = express.Router();
const controller = require('../controllers/availableItemsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     AvailableItem:
 *       type: object
 *       required:
 *         - id
 *         - department
 *         - items
 *         - quantity
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the available item
 *         department:
 *           type: string
 *         items:
 *           type: string
 *         quantity:
 *           type: number
 *         status:
 *           type: string
 *         readyTime:
 *           type: string
 *         sterilizationId:
 *           type: string
 *         machine:
 *           type: string
 *         process:
 *           type: string
 *       example:
 *         id: 'REQ004'
 *         department: 'Cardiology'
 *         items: 'scissors'
 *         quantity: 5
 *         status: 'Sterilized'
 *         readyTime: '17:11'
 *         sterilizationId: 'STE009'
 *         machine: 'Autoclave-2'
 *         process: 'Chemical Sterilization'
 */

/**
 * @swagger
 * tags:
 *   name: AvailableItems
 *   description: Available items management
 */

/**
 * @swagger
 * /availableItems:
 *   get:
 *     summary: Get all available items
 *     tags: [AvailableItems]
 *     responses:
 *       200:
 *         description: List of available items
 *   post:
 *     summary: Create a new available item
 *     tags: [AvailableItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailableItem'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', controller.getAll);
router.post('/', controller.create);

/**
 * @swagger
 * /availableItems/{id}:
 *   get:
 *     summary: Get an available item by ID
 *     tags: [AvailableItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Available item
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update an available item
 *     tags: [AvailableItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailableItem'
 *     responses:
 *       200:
 *         description: Available item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailableItem'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete an available item
 *     tags: [AvailableItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
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