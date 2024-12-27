import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators';

const createUser = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
    });

    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const validateUser = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      token: Joi.string().required()
    });

    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
    });

    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const schema = Joi.object({
      displayName: Joi.string().trim().strict(),
      current_password: Joi.string().pattern(PASSWORD_RULE).message('Current password:', PASSWORD_RULE_MESSAGE),
      new_password: Joi.string().pattern(PASSWORD_RULE).message('New password:', PASSWORD_RULE_MESSAGE)
    });
    console.log(req.body);
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  }
  catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const userValidation = {
  createUser,
  validateUser,
  loginUser,
  updateUser
};
