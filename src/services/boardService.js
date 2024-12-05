import { slugify } from '~/utils/formatters';
import { boardModel } from '~/models/boardModel';
import { cloneDeep } from 'lodash';

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
  const board = await boardModel.getBoard(boardId);

  // Modify response board query, add card to column
  const modifyBoard = cloneDeep(board);
  modifyBoard.columns.forEach(column => {
    column.cards = modifyBoard.cards.filter(card => card.columnId.equals(column._id));
  });
  delete modifyBoard.cards;

  return modifyBoard;
};

export const boardService = {
  createBoard,
  getBoard
};