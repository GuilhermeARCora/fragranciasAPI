const supa = require('../../../config/supabase');

/**
 * Delete an image from a Supabase bucket.
 * @param {string} bucket - The bucket name.
 * @param {string} imageUrl - The full public URL of the image.
 */
async function deleteImage(bucket, imageUrl) {
  if (!imageUrl) return;

  // Extract the relative path after the bucket name
  const url = new URL(imageUrl);
  const { pathname } = url; // /storage/v1/object/public/products/1730918123456.webp
  const pathInBucket = pathname.split(`${bucket}/`)[1]; // "1730918123456.webp"

  if (!pathInBucket) return;

  const { error } = await supa.storage.from(bucket).remove([pathInBucket]);
  if (error) throw error;
}

module.exports = deleteImage;
