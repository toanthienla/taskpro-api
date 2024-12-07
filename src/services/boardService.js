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

const putBoardColumnOrderIds = async (boardId, reqBody) => {
  // If modifying data here, please ensure that corresponding validation
  // is added in the boardModel to maintain data integrity.

  // Models
  const board = await boardModel.putBoardColumnOrderId(boardId, reqBody);
  return board;
};

export const boardService = {
  createBoard,
  getBoard,
  putBoardColumnOrderIds
};