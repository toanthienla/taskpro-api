import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';

const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(3).max(50).required().trim().strict(),
  description: Joi.string().min(3).max(256).required().trim().strict(),
  slug: Joi.string().min(3).required().trim().strict(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
});

const createNew = async (data) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(data);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: id
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  createNew,
  findOneById,
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA
};