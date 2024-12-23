import { v2 as cloudinary } from 'cloudinary';
import streamifire from 'streamifier';
import env from '~/config/enviroment';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

const streamUpload = (fileBuffer, foldername) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: foldername
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifire.createReadStream(fileBuffer).pipe(stream);
  });
};

export const CloudinaryProvider = {
  streamUpload
};