import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { BOARD_TYPES } from '~/utils/constants';
import { columnModel } from '~/models/columnModel';
import { cardModel } from '~/models/cardModel';
import { userModel } from './userModel';

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];
const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(3).max(50).required().trim().strict(),
  description: Joi.string().min(3).max(256).required().trim().strict(),
  slug: Joi.string().min(3).required().trim().strict(),
  type: Joi.string().valid(...Object.values(BOARD_TYPES)).required(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  ownersIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  membersIds: Joi.array().items(
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
    data = await validateData(data);
    data.ownersIds = data.ownersIds.map(id => new ObjectId(id));
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(data);
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
const getBoard = async (userId, boardId) => {
  try {
    const queryCondition = {
      _id: new ObjectId(boardId),
      $or: [
        { ownersIds: { $all: [new ObjectId(userId)] } },
        { membersIds: { $all: [new ObjectId(userId)] } }
      ],
      _destroy: false
    };

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: { $and: [queryCondition] }
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
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'ownersIds',
          foreignField: '_id',
          as: 'owners',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'membersIds',
          foreignField: '_id',
          as: 'members',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
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

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    const queryCondition = {
      $or: [
        // $all: Find me documents where this array field has these specific values
        { ownersIds: { $all: [new ObjectId(userId)] } },
        { membersIds: { $all: [new ObjectId(userId)] } }
      ],
      _destroy: false
    };

    const res = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate(
      [
        {
          $match: { $and: [queryCondition] }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          // $facet: Split the output into separate branches
          $facet: {
            'queryBoards': [
              { $skip: (page - 1) * itemsPerPage },
              { $limit: itemsPerPage }
            ],

            'queryTotalBoards': [{ $count: 'totalBoards' }]
          }
        }
      ],
      { collation: { locale: 'en' } } // Sort a before
    ).toArray();

    return {
      boards: res[0].queryBoards || [],
      totalBoards: res[0].queryTotalBoards[0]?.totalBoards || 0
    };
  } catch (error) {
    throw new Error(error);
  }
};

const updateBoard = async (boardId, updateData) => {
  try {
    // Filter data before update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  createBoard,
  findOneById,
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  getBoard,
  pushColumnOrderIds,
  putBoardColumnOrderId,
  deleteBoardColumnOrderIds,
  getBoards,
  updateBoard
};
