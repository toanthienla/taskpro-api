import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';
import ms from 'ms';
import ApiError from '~/utils/ApiError';

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

const validateUser = async (req, res, next) => {
  try {
    const user = await userService.validateUser(req.body);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);

    // Return handle http only cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: ms('14 days')
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: ms('14 days')
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(StatusCodes.OK).json({ logout: true });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req?.cookies?.refreshToken);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: ms('14 days')
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Refresh Token go wrong, please sign in'));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const userAvatarFile = req.file;

    const user = await userService.updateUser(userId, req.body, userAvatarFile);

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createUser,
  validateUser,
  loginUser,
  logout,
  refreshToken,
  updateUser
};