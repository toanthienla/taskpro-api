import Joi from 'joi';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const CARD_COLLECTION_NAME = 'cards';
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  cover: Joi.string().default(null),
  memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  comments: Joi.array().items({
    userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    avatar: Joi.string(),
    displayName: Joi.string(),
    content: Joi.string().required().trim().strict(),
    commentedAt: Joi.date().timestamp() // Date.now can only use with insertOne
  }).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
});


const validateData = async (data) => {
  const card = await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });

  // If boardId string || columnId string -> ObjectId
  card.boardId = new ObjectId(card.boardId);
  card.columnId = new ObjectId(card.columnId);
  return card;
};

const createCard = async (data) => {
  try {
    return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(
      await validateData(data)
    );
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    });
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found by id in DB!');
  }
};

const updateCard = async (updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(updateData.cardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCardByColumnId = async (columnId) => {
  try {
    await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany(
      { columnId: new ObjectId(columnId) }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const unshiftNewComment = async (cardId, comment) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $push: { comments: { $each: [comment], $position: 0 } } },
      { returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createCard,
  findOneById,
  updateCard,
  deleteCardByColumnId,
  unshiftNewComment
};