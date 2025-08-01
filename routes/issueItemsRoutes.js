const express = require('express');
const router = express.Router();
const controller = require('../controllers/issueItemsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     IssueItem:
 *       type: object
 *       required:
 *         - id
 *         - requestId
 *         - department
 *         - items
 *         - quantity
 *         - issuedTime
 *         - issuedDate
 *         - status
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
 *         issuedTime:
 *           type: string
 *         issuedDate:
 *           type: string
 *         status:
 *           type: string
 *       example:
 *         id: 'ISS001'
 *         requestId: 'REQ001'
 *         department: 'OR-2'
 *         items: 'scissors'
 *         quantity: 4
 *         issuedTime: '13:59'
 *         issuedDate: '2025-07-10'
 *         status: 'Issued (Non-Sterilized)'
 */

/**
 * @swagger
 * tags:
 *   name: IssueItems
 *   description: Issue items management
 */

/**
 * @swagger
 * /issueItems:
 *   get:
 *     summary: Get all issued items
 *     tags: [IssueItems]
 *     responses:
 *       200:
 *         description: List of issued items
 *   post:
 *     summary: Issue a new item
 *     tags: [IssueItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IssueItem'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', controller.getAll);
router.post('/', controller.create);

/**
 * @swagger
 * /issueItems/{id}:
 *   get:
 *     summary: Get an issued item by ID
 *     tags: [IssueItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Issued item
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update an issued item
 *     tags: [IssueItems]
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
 *             $ref: '#/components/schemas/IssueItem'
 *     responses:
 *       200:
 *         description: Issued item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssueItem'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete an issued item
 *     tags: [IssueItems]
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