import { StatusCodes } from 'http-status-codes';
import { boardService } from '~/services/boardService';

const createBoard = async (req, res, next) => {
  try {
    // Services
    const board = await boardService.createBoard(req.body);

    // Return response to client
    res.status(StatusCodes.CREATED).json(board);
  } catch (error) {
    next(error);
  }
};

const getBoard = async (req, res, next) => {
  try {
    // Servies
    const board = await boardService.getBoard(req.params.id);

    // Return response to client
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const putBoardColumnOrderIds = async (req, res, next) => {
  try {
    // Services
    const board = await boardService.putBoardColumnOrderIds(req.params.id, req.body);

    // Return response to client
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const { page, itemsPerPage } = req.query;
    const { boards, totalBoards } = await boardService.getBoards(userId, page, itemsPerPage);

    res.status(StatusCodes.OK).json({ boards, totalBoards });
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createBoard,
  getBoard,
  putBoardColumnOrderIds,
  getBoards
};