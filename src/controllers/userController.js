import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';

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

    console.log(result);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createUser,
  validateUser,
  loginUser
};