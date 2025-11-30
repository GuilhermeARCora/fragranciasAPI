const express = require('express');

const router = express.Router();
const authController = require('./auth.controller');
const protectRoutesMiddleware = require('../../core/middlewares/protectRoutes.middleware');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Este endpoint está documentado apenas para fins de visualização. Ele não pode ser executado via Swagger.
 *     tags: [Auth]
 *     servers:
 *       - url: https://example.com/not-available
 *         description: Endpoint desabilitado no Swagger (somente visualização)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - confirmEmail
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               confirmEmail:
 *                 type: string
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 example: "Senha123!"
 *               confirmPassword:
 *                 type: string
 *                 example: "Senha123!"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
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
 *                   example: "Cadastrado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "64d6c18f22c13b7e0c5e9d42"
 *                         name:
 *                           type: string
 *                           example: "João Silva"
 *                         email:
 *                           type: string
 *                           example: "joao@email.com"
 *                         role:
 *                           type: string
 *                           example: "client"
 *                         active:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           example: "2025-10-21T19:11:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/DuplicateError'
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz login do usuário e retorna o token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 example: "Senha123!"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
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
 *                   example: "Conectado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/login', authController.login);

router.use(protectRoutesMiddleware.protect);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado via token JWT armazenado em cookies.
 *     description: Este endpoint retorna as informações do usuário logado.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sucesso ao recuperar o usuário autenticado
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
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/me', authController.me);

/**
 * @swagger
 * /auth/logout:
 *   delete:
 *     summary: Desconecta o usuário e sobrescreve o token
 *     description: Limpa o cookie JWT.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
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
 *                   example: "Desconectado com sucesso!"
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/logout', authController.logout);

module.exports = router;
