import { ObjectId } from 'mongodb';
import { cardModel } from '~/models/cardModel';
import { columnModel } from '~/models/columnModel';
import { CloudinaryProvider } from '~/providers/CloudinaryProvider';

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

const updateCard = async (cardId, reqBody, reqFile) => {
  const updateData = {
    cardId: new ObjectId(cardId),
    ...reqBody,
    updatedAt: new Date()
  };

  if (reqBody.columnId) {
    updateData.columnId = new ObjectId(reqBody.columnId);
  }

  if (reqFile) {
    // Upload avatar to cloudinary
    const uploadResult = await CloudinaryProvider.streamUpload(reqFile.buffer, 'card-covers');
    updateData.cover = uploadResult.secure_url;
  }

  const card = await cardModel.updateCard(updateData);
  return card;
};

export const cardService = {
  createCard,
  updateCard
};