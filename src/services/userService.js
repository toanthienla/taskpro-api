import { StatusCodes } from 'http-status-codes';
import { userModel } from '~/models/userModel';
import ApiError from '~/utils/ApiError';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pickUser } from '~/utils/formatters';

const createUser = async (reqBody) => {
  const email = reqBody.email;
  const password = reqBody.password;

  // Check email existed?
  const isUserExisted = await userModel.findOneByEmail(email);
  if (isUserExisted) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already existed');
  }

  // Create new user data
  const name = email.split('@')[0];
  const newUser = {
    email: email,
    password: bcryptjs.hashSync(password, 8),
    username: name,
    displayName: name,
    verifyToken: uuidv4()
  };

  // Call userModel to connect database
  const { insertedId } = await userModel.createUser(newUser);
  const createdUser = await userModel.findOneById(insertedId);

  // Send email to user to verify

  // Return user data to controller
  return pickUser(createdUser);
};

export const userService = {
  createUser
};