import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants';
import { userModel } from '~/models/userModel';
import { boardModel } from '~/models/boardModel';
import { ObjectId } from 'mongodb';

const INVALID_UPDATE_FIELDS = ['_id', 'inviterId', 'inviteeId', 'type', 'createdAt'];
const INVITATION_COLLECTION_NAME = 'invitations';
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string().required().valid(...Object.values(INVITATION_TYPES)),

  boardInvitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string().required().valid(...Object.values(BOARD_INVITATION_STATUS))
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
});

const validateData = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createInvitation = async (data) => {
  try {
    // Convert inviterId and inviteeId to ObjectId
    const validatedData = await validateData(data);
    const convertedData = {
      ...validatedData,
      inviterId: new ObjectId(validatedData.inviterId),
      inviteeId: new ObjectId(validatedData.inviteeId),
      boardInvitation: validatedData.boardInvitation
        ? {
          ...validatedData.boardInvitation,
          boardId: new ObjectId(validatedData.boardInvitation.boardId)
        }
        : undefined
    };

    return await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(
      convertedData
    );
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

const findManyByInviteeId = async (inviteeId) => {
  try {
    const queryCondition = {
      inviteeId: new ObjectId(inviteeId),
      _destroy: false
    };

    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).aggregate([
      {
        $match: { $and: [queryCondition] }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviterId',
          foreignField: '_id',
          as: 'inviter',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviteeId',
          foreignField: '_id',
          as: 'invitee',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: 'boardInvitation.boardId',
          foreignField: '_id',
          as: 'board'
        }
      },
      {
        $sort: { createdAt: -1 } // (newest to oldest)
      }
    ]).toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateInvitation = async (invitationId, updateData) => {
  try {
    // Filter data before update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(invitationId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const invitationModel = {
  createInvitation,
  findOneById,
  findManyByInviteeId,
  updateInvitation
};