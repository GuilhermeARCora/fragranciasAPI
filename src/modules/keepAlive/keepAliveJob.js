// The purpose of this is to keep the API and the
// databases alive, as I decided to use free resources
// manual 'pings' are required.

const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const supa = require('../../../config/supabase');
const catchAsync = require('../../core/utils/catchAsync');
const deleteImage = require('../../core/utils/supabaseDelete');
const AppError = require('../../core/utils/appError');

const router = express.Router();

// eslint-disable-next-line consistent-return
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ status: 'fail', message: 'Missing or invalid Authorization header' });
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
    // eslint-disable-next-line no-unused-vars
    const [username, password] = decoded.split(':');

    if (password !== process.env.KEEP_ALIVE_TOKEN) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    next();
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: 'Malformed Authorization header' });
  }
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

const keepMongoAlive = async (newUrl) => {
  const collection = mongoose.connection.collection('keepalive');
  await collection.updateOne(
    { _id: 'keep-alive' },
    { $set: { lastRun: formatTimeStamp(), imageUrl: newUrl } },
    { upsert: true }
  );
};

const keepSupabaseAlive = async (previousUrl) => {
  const bucket = 'keep-alive-images';
  const folder = 'keep-alive/';
  const dummyPath = path.join(__dirname, './keep-alive.webp');

  if (previousUrl) {
    try {
      await deleteImage(bucket, previousUrl);
    } catch (e) {
      throw new AppError('Erro ao deletar imagem', e.status);
    }
  }

  const buffer = fs.readFileSync(dummyPath);

  const filePath = `${folder}${Date.now()}.webp`;
  const { error } = await supa.storage.from(bucket).upload(filePath, buffer, {
    contentType: 'image/webp',
    upsert: true
  });
  if (error) throw error;

  const { data } = supa.storage.from(bucket).getPublicUrl(filePath);

  return data.publicUrl;
};

// controller
const keepAliveTask = catchAsync(async (req, res, next) => {
  const collection = mongoose.connection.collection('keepalive');
  const currentDoc = await collection.findOne({ _id: 'keep-alive' });

  const newUrl = await keepSupabaseAlive(currentDoc?.imageUrl);

  await keepMongoAlive(newUrl);

  res.status(200).json({
    status: 'success',
    message: 'Keep-alive executed'
  });
});

const healthTask = catchAsync(async (req, res, next) => {
  const uptime = formatUptime();
  const timestamp = formatTimeStamp();

  res.status(200).json({
    status: 'ok',
    uptime,
    timestamp
  });
});

router.post('/', keepAliveTask);
router.get('/health', healthTask);

module.exports = router;
