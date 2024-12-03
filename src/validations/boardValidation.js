import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required().trim().strict(),
    description: Joi.string().min(3).max(256).required().trim().strict()
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const boardValidation = {
  createNew
};
