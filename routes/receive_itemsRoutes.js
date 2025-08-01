const express = require('express');
const router = express.Router();
const controller = require('../controllers/receive_itemsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     ReceiveItem:
 *       type: object
 *       required:
 *         - id
 *         - requestId
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
 *         requestId:
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
 *         receivedDate:
 *           type: string
 *         receivedTime:
 *           type: string
 *       example:
 *         id: 'REC001'
 *         requestId: 'REQ001'
 *         department: 'Cardiology'
 *         items: 'scissors'
 *         quantity: 4
 *         priority: 'High'
 *         requestedBy: 'Anjali'
 *         status: 'Approved'
 *         date: '2025-07-02'
 *         time: '01:53 pm'
 *         receivedDate: '2025-07-02'
 *         receivedTime: '02:00 pm'
 */

/**
 * @swagger
 * tags:
 *   name: ReceiveItems
 *   description: Receive items management
 */

/**
 * @swagger
 * /receive_items:
 *   get:
 *     summary: Get all received items
 *     tags: [ReceiveItems]
 *     responses:
 *       200:
 *         description: List of received items
 *   post:
 *     summary: Create a new received item
 *     tags: [ReceiveItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReceiveItem'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', controller.getAll);
router.post('/', controller.create);

/**
 * @swagger
 * /receive_items/{id}:
 *   get:
 *     summary: Get a received item by ID
 *     tags: [ReceiveItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Received item
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a received item
 *     tags: [ReceiveItems]
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
 *             $ref: '#/components/schemas/ReceiveItem'
 *     responses:
 *       200:
 *         description: Received item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReceiveItem'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a received item
 *     tags: [ReceiveItems]
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
router.patch('/:id', controller.update); // Add PATCH endpoint
router.delete('/:id', controller.remove);

module.exports = router; 