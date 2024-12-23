import { slugify } from '~/utils/formatters';
import { boardModel } from '~/models/boardModel';
import { cloneDeep } from 'lodash';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants';

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

  if (!board) {
    return null;
  }

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

const getBoards = async (userId, page, itemsPerPage) => {
  if (!page) {
    page = DEFAULT_PAGE;
  }
  if (!itemsPerPage) {
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
  }

  const { boards, totalBoards } = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10));

  return { boards, totalBoards };
};

export const boardService = {
  createBoard,
  getBoard,
  putBoardColumnOrderIds,
  getBoards
};