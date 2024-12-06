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

export const columnService = {
  createColumn
};