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

export const cardService = {
  createCard
};