import { columnModel } from '~/models/columnModel';
import { boardModel } from '~/models/boardModel';

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

const putColumnCardOrderIdsAPI = async (columnId, cardOrderIds) => {
  // If modifying data here, please ensure that corresponding validation
  // is added in the boardModel to maintain data integrity.

  const column = await columnModel.putColumnCardOrderIdsAPI(columnId, cardOrderIds);
  return column;
};

export const columnService = {
  createColumn,
  putColumnCardOrderIdsAPI
};