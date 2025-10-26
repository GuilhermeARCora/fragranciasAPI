// The purpose of this is to keep both data bases alive,
// if no uploads are sent to them they will get paused,
// demanding manual restart.

const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const imageUpload = require('../middlewares/uploadImageMiddleware');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

const uploadImage = imageUpload('keep-alive-images', {
  folder: 'keep-alive/',
  fieldName: 'image'
});

// eslint-disable-next-line consistent-return
router.use((req, res, next) => {
  const envToken = process.env.KEEP_ALIVE_TOKEN;
  let providedToken = null;

  if (req.headers['x-keep-alive-token']) {
    providedToken = req.headers['x-keep-alive-token'];
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Basic ')) {
    try {
      const base64Credentials = req.headers.authorization.split(' ')[1];
      const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
      // eslint-disable-next-line no-unused-vars
      const [username, password] = decoded.split(':');
      providedToken = password;
    } catch (err) {
      return res.status(400).json({ status: 'fail', message: 'Malformed Authorization header' });
    }
  }

  if (!providedToken || providedToken !== envToken) {
    return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
  }

  next();
});

const keepMongoAlive = catchAsync(async () => {
  const collection = mongoose.connection.collection('keepalive');
  await collection.updateOne(
    { _id: 'keep-alive' },
    { $set: { lastRun: new Date() } },
    { upsert: true }
  );
});

const keepSupabaseAlive = catchAsync(async () => {
  const dummyPath = path.join(__dirname, './keep-alive.webp');
  const req = { file: { buffer: fs.readFileSync(dummyPath) } };
  const res = {};
  const next = (err) => { if (err) throw err; };

  await uploadImage[1](req, res, next);
});

const keepAliveTask = catchAsync(async (req, res, next) => {
  await keepMongoAlive();
  await keepSupabaseAlive();
  if (res) res.status(200).json({ status: 'success', message: 'Keep-alive executed' });
});

const formatUptime = function () {
  const uptime = process.uptime();
  const days = Math.floor(uptime / (24 * 3600));
  const hours = Math.floor((uptime % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
};

const formatTimeStamp = function () {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(new Date());
};

const healthTask = catchAsync(async (req, res, next) => {
  const uptime = formatUptime();
  const timestamp = formatTimeStamp();

  res.status(200).json({
    status: 'ok',
    uptime,
    timestamp
  });
});

router.post('/manual', keepAliveTask);
router.get('/health', healthTask);

module.exports = router;
