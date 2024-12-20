import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { BOARD_TYPES } from '~/utils/constants';
import { columnModel } from '~/models/columnModel';
import { cardModel } from '~/models/cardModel';

const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(3).max(50).required().trim().strict(),
  description: Joi.string().min(3).max(256).required().trim().strict(),
  slug: Joi.string().min(3).required().trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
});

const validateData = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createBoard = async (data) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(
      await validateData(data)
    );
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    });
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found by id in DB!');
  }
};

// Add aggregation mongodb function
const getBoard = async (boardId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(boardId),
          _destroy: false
        }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ]).toArray();
    return result[0];
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found by id in DB!');
  }
};

// Call in columnService
const pushColumnOrderIds = async (column) => {
  await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(column.boardId) },
    { $push: { columnOrderIds: column._id.toString() } },
    { returnDocument: 'after' }
  );
};

const putBoardColumnOrderId = async (boardId, columnOrderIds) => {
  return await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(boardId) },
    { $set: columnOrderIds },
    { returnDocument: 'after' }
  );
};

const deleteBoardColumnOrderIds = async (columnId) => {
  return await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .updateOne(
      { columnOrderIds: { $in: [columnId] } }, // Find the board
      { $pull: { columnOrderIds: columnId } } // Remove columnId
    );
};

export const boardModel = {
  createBoard,
  findOneById,
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  getBoard,
  pushColumnOrderIds,
  putBoardColumnOrderId,
  deleteBoardColumnOrderIds
};
