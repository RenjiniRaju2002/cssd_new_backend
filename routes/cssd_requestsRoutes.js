const express = require('express');
const router = express.Router();
const controller = require('../controllers/cssd_requestsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     CssdRequest:
 *       type: object
 *       required:
 *         - id
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
 *         id: 'REQ001'
 *         department: 'Cardiology'
 *         items: 'scissors'
 *         quantity: 4
 *         priority: 'High'
 *         requestedBy: 'System'
 *         status: 'Requested'
 *         date: '2025-07-02'
 *         time: '01:53 pm'
 */

/**
 * @swagger
 * tags:
 *   name: CssdRequests
 *   description: CSSD request management
 */

/**
 * @swagger
 * /cssd_requests:
 *   get:
 *     summary: Get all CSSD requests
 *     tags: [CssdRequests]
 *     responses:
 *       200:
 *         description: List of CSSD requests
 *   post:
 *     summary: Create a new CSSD request
 *     tags: [CssdRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CssdRequest'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', controller.getAll);
router.post('/', controller.create);

/**
 * @swagger
 * /cssd_requests/{id}:
 *   get:
 *     summary: Get a CSSD request by ID
 *     tags: [CssdRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       200:
 *         description: CSSD request
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a CSSD request
 *     tags: [CssdRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CssdRequest'
 *     responses:
 *       200:
 *         description: CSSD request found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CssdRequest'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a CSSD request
 *     tags: [CssdRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

/**
 * @swagger
 * /cssd_requests/{id}/approve:
 *   patch:
 *     summary: Approve a CSSD request
 *     tags: [CssdRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request approved successfully
 *       404:
 *         description: Request not found
 */
router.patch('/:id/approve', controller.approve);

/**
 * @swagger
 * /cssd_requests/{id}/reject:
 *   patch:
 *     summary: Reject a CSSD request
 *     tags: [CssdRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request rejected successfully
 *       404:
 *         description: Request not found
 */
router.patch('/:id/reject', controller.reject);

module.exports = router;
