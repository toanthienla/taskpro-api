import { cardModel } from '~/models/cardModel';
import { columnModel } from '~/models/columnModel';

const createCard = async (reqBody) => {
  const card = {
    ...reqBody
  };

  // Models
  const { insertedId } = await cardModel.createCard(card);
  const createdCard = await cardModel.findOneById(insertedId);

  // Update cardOrderIds in collection Column
  await columnModel.pushCardOrderIds(createdCard);

  return createdCard;
};

const updateCardColumnId = async (columnId, cardId) => {
  // If modifying data here, please ensure that corresponding validation
  // is added in the boardModel to maintain data integrity.
  const card = await cardModel.updateCardColumnId(columnId, cardId);
  return card;
};

export const cardService = {
  createCard,
  updateCardColumnId
};