import { JwtProvider } from '~/providers/JwtProvider';
import env from '~/config/enviroment';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

// Function to authenticate access token request is valid
const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken;

  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access token not found.'));
    return;
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_PRIVATE_KEY);
    req.jwtDecoded = accessTokenDecoded;
    next();
  } catch (error) {
    // If accessToken expired return code 410 to call api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'));
      return;
    }

    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized.'));
  }
};

export const authMiddleware = {
  isAuthorized
};