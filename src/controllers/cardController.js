import { StatusCodes } from 'http-status-codes';
import { cardService } from '~/services/cardService';

const createCard = async (req, res, next) => {
  try {
    // Services
    const card = await cardService.createCard(req.body);

    // Return response to client
    res.status(StatusCodes.CREATED).json(card);
  } catch (error) {
    next(error);
  }
};

const updateCard = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    const card = await cardService.updateCard(cardId, req.body, req.file);
    res.status(StatusCodes.OK).json(card);
  } catch (error) {
    next(error);
  }
};


export const cardController = {
  createCard,
  updateCard
};