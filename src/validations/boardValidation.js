import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { BOARD_TYPES } from '~/utils/constants';

const createBoard = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required().trim().strict(),
    description: Joi.string().min(3).max(256).required().trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next(); // Controller
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const boardValidation = {
  createBoard
};
