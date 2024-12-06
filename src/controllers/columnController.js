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


export const columnController = {
  createColumn
};