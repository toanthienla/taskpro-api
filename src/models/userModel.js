import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

const Joi = require('joi');
const { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } = require('~/utils/validators');

const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
};
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt'];

const USER_COLLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),

  username: Joi.string().required(),
  displayName: Joi.string().required(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
});

const validateData = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createUser = async (data) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(
      await validateData(data)
    );
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (userId) => {
  try {
    const result = GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByEmail = async (email) => {
  try {
    const result = GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: email });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (userId, updateData) => {
  try {
    // Filter data before update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  createUser,
  findOneById,
  findOneByEmail,
  update,
  USER_COLLECTION_NAME
};