import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { CARD_MEMBER_ACTION } from '~/utils/constants';

const createCard = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required().trim().strict(),
    boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next(); // Controller
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const updateCard = async (req, res, next) => {
  const schema = Joi.object({
    columnId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().trim().strict(),
    description: Joi.string().trim().strict(),

    // Add comment to card
    commentToAdd: Joi.object({
      avatar: Joi.string(),
      displayName: Joi.string(),
      content: Joi.string().trim().strict()
    }),

    // Add/remove member from card
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    action: Joi.string().valid(...Object.values(CARD_MEMBER_ACTION))
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const cardValidation = {
  createCard,
  updateCard
};
