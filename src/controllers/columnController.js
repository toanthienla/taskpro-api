import { StatusCodes } from 'http-status-codes';
import { columnService } from '~/services/columnService';

const createColumn = async (req, res, next) => {
  try {
    // Services
    const column = await columnService.createColumn(req.body);

    // Return response to client
    res.status(StatusCodes.CREATED).json(column);
  } catch (error) {
    next(error);
  }
};

const putColumnCardOrderIds = async (req, res, next) => {
  try {
    const column = await columnService.putColumnCardOrderIdsAPI(req.body.columnId, req.body.cardOrderIds);

    res.status(StatusCodes.OK).json(column);
  } catch (error) {
    next(error);
  }
};


export const columnController = {
  createColumn,
  putColumnCardOrderIds
};