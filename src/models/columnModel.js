import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];
const COLUMN_COLLECTION_NAME = 'columns';
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  cards: Joi.array().default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
});

const validateData = async (data) => {
  const column = await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });

  // If boardId string -> ObjectId
  column.boardId = new ObjectId(column.boardId);
  return column;
};

const createColumn = async (data) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(
      await validateData(data)
    );
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    });
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found by id in DB!');
  }
};

const pushCardOrderIds = async (card) => {
  await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(card.columnId) },
    { $push: { cardOrderIds: card._id.toString() } },
    { returnDocument: 'after' }
  );
};

const updateColumn = async (columnId, updateData) => {
  try {
    // Filter data before update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(columnId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteColumnCardOrderIds = async (columnId, cardId) => {
  await GET_DB().collection(COLUMN_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(columnId) },
    { $pull: { cardOrderIds: cardId } }
  );
};

const deleteColumn = async (columnId) => {
  await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne(
    { _id: new ObjectId(columnId) }
  );
};

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createColumn,
  findOneById,
  pushCardOrderIds,
  updateColumn,
  deleteColumnCardOrderIds,
  deleteColumn
};