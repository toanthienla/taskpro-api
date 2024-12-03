import { StatusCodes } from 'http-status-codes';
import { boardService } from '~/services/boardService';
import { boardModel } from '~/models/boardModel';

const createNew = async (req, res, next) => {
  try {
    // Services
    const board = await boardService.createNew(req.body);

    // Models
    const { insertedId } = await boardModel.createNew(board);
    const createdBoard = await boardModel.findOneById(insertedId);

    // Return response to client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew
};