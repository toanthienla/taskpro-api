import { columnModel } from '~/models/columnModel';
import { boardModel } from '~/models/boardModel';
import { cardModel } from '~/models/cardModel';

const createColumn = async (reqBody) => {
  const column = {
    ...reqBody
  };

  // Models
  const { insertedId } = await columnModel.createColumn(column);
  const createdColumn = await columnModel.findOneById(insertedId);

  // Update columnOrderIds in collection Board
  await boardModel.pushColumnOrderIds(createdColumn);

  return createdColumn;
};

const updateColumn = async (reqBody) => {
  const updateData = {};

  if (reqBody.cardOrderIds) {
    updateData.cardOrderIds = reqBody.cardOrderIds;
  } else if (reqBody.title) {
    updateData.title = reqBody.title;
  }

  const column = await columnModel.updateColumn(reqBody.columnId, updateData);
  return column;
};

const deleteColumnCardOrderIds = async (columnId, cardId) => {
  // If modifying data here, please ensure that corresponding validation
  // is added in the boardModel to maintain data integrity.
  const column = await columnModel.deleteColumnCardOrderIds(columnId, cardId);
  return column;
};

const deleteColumn = async (columnId) => {
  // If modifying data here, please ensure that corresponding validation
  // is added in the boardModel to maintain data integrity.
  await boardModel.deleteBoardColumnOrderIds(columnId);
  await columnModel.deleteColumn(columnId);
  await cardModel.deleteCardByColumnId(columnId);
};

export const columnService = {
  createColumn,
  updateColumn,
  deleteColumnCardOrderIds,
  deleteColumn
};