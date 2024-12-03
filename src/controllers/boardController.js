const createNew = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Validation: create new board success'
    });
    console.log(req.body);
  } catch (error) {
    res.status(500).json({
      errors: error.message()
    });
  }
};

export const boardController = {
  createNew
}; 