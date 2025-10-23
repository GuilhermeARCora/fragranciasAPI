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

// configura o middleware para o bucket "keep-alive-images"
const uploadImage = imageUpload('keep-alive-images', {
  folder: 'keep-alive/',
  fieldName: 'image'
});

// eslint-disable-next-line consistent-return
router.use((req, res, next) => {
  const token = req.headers['x-keep-alive-token'];
  if (!token || token !== process.env.KEEP_ALIVE_TOKEN) {
    return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
  }
  next();
});

// 1) Mantém o Mongo ativo (upsert)
const keepMongoAlive = catchAsync(async () => {
  const collection = mongoose.connection.collection('keepalive');
  await collection.updateOne(
    { _id: 'keep-alive' },
    { $set: { lastRun: new Date() } },
    { upsert: true }
  );
});

// 2) Mantém o Supabase ativo enviando imagem dummy
const keepSupabaseAlive = catchAsync(async () => {
  const dummyPath = path.join(__dirname, './keep-alive.webp');
  const req = { file: { buffer: fs.readFileSync(dummyPath) } };
  const res = {};
  const next = (err) => { if (err) throw err; };

  await uploadImage[1](req, res, next);
});

// 3) Task principal (usada pelo endpoint e pela Action)
const keepAliveTask = catchAsync(async (req, res, next) => {
  await keepMongoAlive();
  await keepSupabaseAlive();
  if (res) res.status(200).json({ status: 'success', message: 'Keep-alive executed' });
});

router.post('/manual', keepAliveTask);

module.exports = router;
