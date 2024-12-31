import { slugify } from '~/utils/formatters';
import { boardModel } from '~/models/boardModel';
import { cloneDeep } from 'lodash';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const createBoard = async (userId, reqBody) => {
  const board = {
    ...reqBody,
    slug: slugify(reqBody.title),
    ownerIds: [userId]
  };

  // Models
  const { insertedId } = await boardModel.createBoard(board);
  const createdBoard = await boardModel.findOneById(insertedId);

  return createdBoard;
};

const getBoard = async (userId, boardId) => {
  const board = await boardModel.getBoard(userId, boardId);

  if (!board) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found by id in DB!');
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

const getBoards = async (userId, page, itemsPerPage, queryFilter) => {
  if (!page) {
    page = DEFAULT_PAGE;
  }
  if (!itemsPerPage) {
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
  }

  const { boards, totalBoards } = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10), queryFilter);

  return { boards, totalBoards };
};

export const boardService = {
  createBoard,
  getBoard,
  putBoardColumnOrderIds,
  getBoards
};