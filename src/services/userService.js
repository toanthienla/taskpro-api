import { StatusCodes } from 'http-status-codes';
import { userModel } from '~/models/userModel';
import ApiError from '~/utils/ApiError';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pickUser } from '~/utils/formatters';
import { WEBSITE_DOMAIN } from '~/utils/constants';
import { BrevoProvider } from '~/providers/BrevoProvider';
import env from '~/config/enviroment';
import { JwtProvider } from '~/providers/JwtProvider';
import { CloudinaryProvider } from '~/providers/CloudinaryProvider';

const createUser = async (reqBody) => {
  const email = reqBody.email;
  const password = reqBody.password;

  // Check email existed?
  const isUserExisted = await userModel.findOneByEmail(email);
  if (isUserExisted) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already registered.');
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

  // Form content email
  const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${createdUser.email}&token=${createdUser.verifyToken}`;
  const subject = 'Welcome to TaskPro! Verify your email to get started 🎉';
  const htmlContent = `
      <p>Hi ${createdUser.username},</p>
        <p>Thanks for signing up for TaskPro! We're excited to have you on board.</p>
        <p>To unlock the full power of TaskPro and start managing your tasks like a pro, please verify your email address by clicking the button below:</p>
        <p style="text-align: left;">
        <a href="${verificationLink}">${verificationLink}</a>
        </p>
      <p>This will confirm your account and give you access to all of TaskPro's amazing features.</p>
      <p>If you didn't create an account with TaskPro, you can safely ignore this email.</p>
      <p>Happy tasking,</p>
      <p>TaskPro</p>
  `;

  // Use Provider to send email
  await BrevoProvider.sendEmail(email, subject, htmlContent);

  // Return user data to controller
  return pickUser(createdUser);
};

// Gmail validation
const validateUser = async (reqBody) => {
  const email = reqBody.email;
  const token = reqBody.token;

  // Check user email and token correct?
  const user = await userModel.findOneByEmail(email);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user.isActive) {
    throw new ApiError(StatusCodes.CONFLICT, 'Account already activated');
  }
  if (token !== user.verifyToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid verification token');
  }

  // Update verifyToken and isActive
  const updateData = {
    verifyToken: null,
    isActive: true
  };
  await userModel.update(user._id, updateData);

  return pickUser(user);
};

const loginUser = async (reqBody) => {
  const email = reqBody.email;
  const password = reqBody.password;

  const user = await userModel.findOneByEmail(email);
  if (!user) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid email or password');
  }
  if (!bcryptjs.compareSync(password, user.password)) {
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid email or password');
  }
  if (!user.isActive) {
    throw new ApiError(StatusCodes.CONFLICT, 'Account is not yet activated');
  }

  const userInfo = {
    _id: user._id,
    email: email
  };

  // Generate access and refresh token (JWT)
  const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_PRIVATE_KEY, env.ACCESS_TOKEN_LIFE);
  const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_PRIVATE_KEY, env.REFRESH_TOKEN_LIFE);

  return { accessToken, refreshToken, ...pickUser(user) };
};

const refreshToken = async (clientRefreshToken) => {
  const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_PRIVATE_KEY);

  const userInfo = {
    _id: refreshTokenDecoded._id,
    email: refreshTokenDecoded.email
  };

  const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_PRIVATE_KEY, env.ACCESS_TOKEN_LIFE);
  return { accessToken };
};

const updateUser = async (userId, reqBody, userAvatarFile) => {
  const user = await userModel.findOneById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (!user.isActive) {
    throw new ApiError(StatusCodes.CONFLICT, 'Account is not yet activated');
  }

  const updateData = {};
  if (reqBody.current_password && reqBody.new_password) {
    if (!bcryptjs.compareSync(reqBody.current_password, user.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid current password');
    }
    updateData.password = bcryptjs.hashSync(reqBody.new_password, 8);
  } else if (reqBody.displayName) {
    updateData.displayName = reqBody.displayName;
  } else if (userAvatarFile) {
    // Upload avatar to cloudinary
    const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'avatars');
    updateData.avatar = uploadResult.secure_url;
  }

  const updatedUser = await userModel.update(userId, {
    ...updateData,
    updatedAt: new Date()
  });

  return pickUser(updatedUser);
};

export const userService = {
  createUser,
  validateUser,
  loginUser,
  refreshToken,
  updateUser
};