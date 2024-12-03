import { StatusCodes } from 'http-status-codes';

const createNew = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({
      message: 'Validation: create new board success'
    });
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew
};