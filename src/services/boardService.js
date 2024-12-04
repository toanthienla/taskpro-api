import { slugify } from '~/utils/formatters';
import { boardModel } from '~/models/boardModel';

const createBoard = async (reqBody) => {
  const board = {
    ...reqBody,
    slug: slugify(reqBody.title)
  };

  // Models
  const { insertedId } = await boardModel.createBoard(board);
  const createdBoard = await boardModel.findOneById(insertedId);

  return createdBoard;
};

const getBoard = async (boardId) => {
  return await boardModel.getBoard(boardId);
};

export const boardService = {
  createBoard,
  getBoard
};