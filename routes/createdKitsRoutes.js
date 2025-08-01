const express = require('express');
const router = express.Router();
const controller = require('../controllers/createdKitsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatedKit:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - department
 *         - items
 *         - quantity
 *         - priority
 *         - status
 *         - date
 *         - time
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         department:
 *           type: string
 *         items:
 *           type: string
 *         quantity:
 *           type: number
 *         priority:
 *           type: string
 *         requestedBy:
 *           type: string
 *         status:
 *           type: string
 *         date:
 *           type: string
 *         time:
 *           type: string
 *       example:
 *         id: 'KIT001'
 *         name: 'Surgical kit'
 *         department: 'Cardiology'
 *         items: 'scissors, forcaps'
 *         quantity: 12
 *         priority: 'High'
 *         requestedBy: 'System'
 *         status: 'Active'
 *         date: '2025-07-03'
 *         time: '12:08 pm'
 */

/**
 * @swagger
 * tags:
 *   name: CreatedKits
 *   description: Created kits management
 */

/**
 * @swagger
 * /createdKits:
 *   get:
 *     summary: Get all created kits
 *     tags: [CreatedKits]
 *     responses:
 *       200:
 *         description: List of created kits
 *   post:
 *     summary: Create a new kit
 *     tags: [CreatedKits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatedKit'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', controller.getAll);
router.post('/', controller.create);

/**
 * @swagger
 * /createdKits/{id}:
 *   get:
 *     summary: Get a kit by ID
 *     tags: [CreatedKits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kit ID
 *     responses:
 *       200:
 *         description: Kit
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a kit
 *     tags: [CreatedKits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatedKit'
 *     responses:
 *       200:
 *         description: Kit found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatedKit'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a kit
 *     tags: [CreatedKits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kit ID
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