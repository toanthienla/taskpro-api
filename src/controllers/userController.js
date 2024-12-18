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

export const userController = {
  createUser
};