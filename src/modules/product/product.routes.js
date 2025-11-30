const express = require('express');

const router = express.Router();
const productController = require('./product.controller');
const protectRoutesMiddleware = require('../../core/middlewares/protectRoutes.middleware');
const restrictRouteMiddleware = require('../../core/middlewares/restrictRoutes.middleware');
const imageUpload = require('../../core/middlewares/uploadImage.middleware');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos filtrados
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: cod
 *         schema:
 *           type: string
 *         description: Código do produto
 *       - in: query
 *         name: fullPrice
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por produtos ativos ou inativos
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Lista de categorias separadas por vírgula
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
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
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     amount:
 *                       type: number
 *                       example: 12
 */
router.route('/').get(productController.findAll);

/**
 * @swagger
 * /products/latest:
 *   get:
 *     summary: Lista os 10 produtos mais recentes
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Produtos retornados com sucesso
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
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     amount:
 *                       type: number
 *                       example: 10
 */
router.route('/latest').get(productController.newProducts);

/**
 * @swagger
 * /products/statistics:
 *   get:
 *     summary: Retorna estatísticas dos produtos
 *     tags: [Products]
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
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     countActiveProds:
 *                       type: number
 *                       example: 28
 *                     countInactiveProds:
 *                       type: number
 *                       example: 1
 *                     countInPromo:
 *                       type: number
 *                       example: 12
 *                     greatestDiscount:
 *                       type: number
 *                       example: 30
 *                     countProdsAroma:
 *                       type: number
 *                       example: 20
 *                     countProdsAuto:
 *                       type: number
 *                       example: 12
 *                     countProdsCasa:
 *                       type: number
 *                       example: 15
 *                     countProdsDest:
 *                       type: number
 *                       example: 10
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.route('/statistics').get(protectRoutesMiddleware.protect, restrictRouteMiddleware.restrictTo('admin'), productController.findStatistics);

/**
 * @swagger
 * /products/category/{category}:
 *   get:
 *     summary: Lista produtos por categoria
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [aromatizadores, autoCuidado, casaEBemEstar, destaque]
 *     responses:
 *       200:
 *         description: Produtos retornados com sucesso
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
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     amount:
 *                       type: number
 *                       example: 1
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.route('/category/:category').get(productController.findByCategory);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um único produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
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
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route('/:id').get(productController.findOne);

router.use(protectRoutesMiddleware.protect);
router.use(restrictRouteMiddleware.restrictTo('admin'));

// bucket = "products-images, folder = "products/", fieldName = "image" "
const uploadImage = imageUpload(process.env.PRODUCTS_BUCKET, { folder: 'products/', fieldName: 'image' });

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - fullPrice
 *               - description
 *               - image
 *               - categories
 *               - cod
 *             properties:
 *               name:
 *                 type: string
 *               fullPrice:
 *                 type: number
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               promoPercentage:
 *                 type: number
 *               cod:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
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
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         $ref: '#/components/responses/DuplicateError'
 */
router.route('/').post(uploadImage, productController.create);

/**
 * @swagger
 * /products/{id}/status:
 *   patch:
 *     summary: Atualiza apenas o campo "active" do produto
 *     tags: [Products]
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
 *             required:
 *               - active
 *             properties:
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
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
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route('/:id/status').patch(productController.changeStatus);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Atualiza os dados do produto
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               fullPrice:
 *                 type: number
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               promoPercentage:
 *                 type: number
 *               cod:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
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
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         $ref: '#/components/responses/DuplicateError'
 */
router.route('/:id').patch(uploadImage, productController.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.route('/:id').delete(productController.remove);

module.exports = router;
