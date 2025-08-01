const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockItemsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     StockItem:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - category
 *         - quantity
 *         - location
 *         - minLevel
 *         - status
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         quantity:
 *           type: number
 *         location:
 *           type: string
 *         minLevel:
 *           type: number
 *         status:
 *           type: string
 *       example:
 *         id: 'STK001'
 *         name: 'Forceps'
 *         category: 'Non-Reusable'
 *         quantity: 4
 *         location: 'Storage C'
 *         minLevel: 3
 *         status: 'In Stock'
 */

/**
 * @swagger
 * tags:
 *   name: StockItems
 *   description: Stock items management
 */

/**
 * @swagger
 * /stockItems:
 *   get:
 *     summary: Get all stock items
 *     tags: [StockItems]
 *     responses:
 *       200:
 *         description: List of stock items
 *   post:
 *     summary: Create a new stock item
 *     tags: [StockItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockItem'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', controller.getAll);
router.post('/', controller.create);

/**
 * @swagger
 * /stockItems/{id}:
 *   get:
 *     summary: Get a stock item by ID
 *     tags: [StockItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Stock item
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a stock item
 *     tags: [StockItems]
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
 *             $ref: '#/components/schemas/StockItem'
 *     responses:
 *       200:
 *         description: Stock item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockItem'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a stock item
 *     tags: [StockItems]
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