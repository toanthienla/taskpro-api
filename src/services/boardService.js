import { slugify } from '~/utils/formatters';

const createNew = async (reqBody) => {
  const board = {
    ...reqBody,
    slug: slugify(reqBody.title)
  };

  return board;
};

export const boardService = {
  createNew
};