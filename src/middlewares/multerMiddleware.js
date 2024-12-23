import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import ApiError from '~/utils/ApiError';
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES } from '~/utils/validators';

const customFileFilter = (req, file, cb) => {
  // In callback first parameter is an error, second is a error boolean
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, 'File type is not supported!'), false);
  }

  return cb(null, true);
};

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
});

export const multerMiddleware = { upload };