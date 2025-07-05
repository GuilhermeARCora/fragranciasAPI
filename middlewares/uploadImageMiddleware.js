const multer = require('multer');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// 1) init Supabase admin client
const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false, detectSessionInUrl: false } }
);

// 2) re-usable multer instance (memory)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * imageUpload(bucket, opts):
 *  - bucket: your Supabase bucket name
 *  - opts.folder: where to store in the bucket (e.g. "products/")
 *  - opts.fieldName: form-field key (default: "image")
 *  - opts.width, opts.quality: sharp options
 */
function imageUpload(bucket, opts = {}) {
  const {
    folder    = '',
    fieldName = 'image',
    width     = 800,
    quality   = 80
  } = opts;

  return [
    // Step A: parse single file
    upload.single(fieldName),

    // Step B: transform + upload
    catchAsync(async (req, res, next) => {

      if (!req.file) {
        return next(new AppError('No file provided', 400));
      }

        // 1. convert to WebP + resize
        const webpBuffer = await sharp(req.file.buffer)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();

        // 2. unique path
        const timestamp = Date.now();
        const path = `${folder}${timestamp}.webp`;

        // 3. upload
        const { error } = await supa
          .storage
          .from(bucket)
          .upload(path, webpBuffer, {
            contentType: 'image/webp',
            upsert: false
          });
        if (error) throw error;

        // 4. get public URL
        const { data } = supa
          .storage
          .from(bucket)
          .getPublicUrl(path);
        req.fileUrl = data.publicUrl;

        next();

    })
  ];
}

module.exports = imageUpload;
