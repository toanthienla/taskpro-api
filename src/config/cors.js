import { WHITELIST_DOMAINS } from '~/utils/constants';
import env from '~/config/enviroment';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

export const corsOptions = {
  origin: function (origin, callback) {
    // Any domains can access in dev mode
    if (env.BUILD_MODE === 'dev') {
      return callback(null, true);
    }

    // Only whitelist domain can access
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`));
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS allow access cookies from request
  credentials: true
};