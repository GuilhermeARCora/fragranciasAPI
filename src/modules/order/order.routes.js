const express = require('express');

const router = express.Router();
const orderController = require('./order.controller');
const protectRoutesMiddleware = require('../../core/middlewares/protectRoutes.middleware');
const restrictRouteMiddleware = require('../../core/middlewares/restrictRoutes.middleware');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dados inválidos na requisição
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/BadRequest'
 */
router.route('/').post(orderController.create);

/**
 * @swagger
 * /orders/statistics:
 *   get:
 *     summary: Retorna estatísticas gerais dos pedidos
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "success" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     amountStatusPendente: { type: number, example: 10 }
 *                     amountStatusConcluido: { type: number, example: 5 }
 *                     amountStatusCancelado: { type: number, example: 2 }
 *                     amountInTheLastTwoDays: { type: number, example: 3 }
 *                     amountWithFinalPriceOverFiveHundred: { type: number, example: 4 }
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.route('/statistics')
  .get(protectRoutesMiddleware.protect, restrictRouteMiddleware.restrictTo('admin'), orderController.findStatistics);

/**
 * @swagger
 * /orders/ordersEvolution:
 *   get:
 *     summary: Retorna a evolução mensal dos pedidos
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Evolução retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "success" }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month: { type: string, example: "jan" }
 *                       PENDENTE: { type: number, example: 2 }
 *                       CONCLUIDO: { type: number, example: 1 }
 *                       CANCELADO: { type: number, example: 0 }
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.route('/ordersEvolution')
  .get(protectRoutesMiddleware.protect, restrictRouteMiddleware.restrictTo('admin'), orderController.findOrdersEvolution);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: O ID do pedido não existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/NotFoundError'
 */
router.route('/:id').get(orderController.findOne);

router.use(protectRoutesMiddleware.protect);
router.use(restrictRouteMiddleware.restrictTo('admin'));

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos com filtros
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, CONCLUIDO, CANCELADO]
 *       - in: query
 *         name: totalUnits
 *         schema: { type: number }
 *       - in: query
 *         name: totalFullPrice
 *         schema: { type: number }
 *       - in: query
 *         name: totalCurrentPrice
 *         schema: { type: number }
 *       - in: query
 *         name: totalDiscount
 *         schema: { type: number }
 *       - in: query
 *         name: totalPixPrice
 *         schema: { type: number }
 *       - in: query
 *         name: daysAgo
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     amount:
 *                       type: number
 *                       example: 5
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.route('/').get(orderController.findAll);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONCLUIDO, CANCELADO]
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "success" }
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *        description: Erro de regra de negócio ao atualizar o pedido
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: number
 *                  example: 400
 *                message:
 *                  type: string
 *                  example: "O pedido já foi concluído!"
 *            examples:
 *              pedidoConcluido:
 *                summary: Pedido já concluído
 *                value:
 *                  status: 400
 *                  message: "O pedido já foi concluído!"
 *              pedidoCancelado:
 *                summary: Pedido já cancelado
 *                value:
 *                  status: 400
 *                  message: "O pedido já foi cancelado!"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.route('/:id/status').patch(orderController.update);

module.exports = router;
