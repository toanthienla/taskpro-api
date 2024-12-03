import Joi from 'joi';

const createNew = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required().trim().strict(),
    description: Joi.string().min(10).max(500).required().trim().strict()
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    // 422 code: request contains invalid data
    res.status(422).json({
      errors: new Error(error).message
    });
  }
};

export const boardValidation = {
  createNew
};
