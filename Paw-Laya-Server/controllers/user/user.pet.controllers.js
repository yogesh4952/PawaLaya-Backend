import Pet from '../../models/pet.models.js';

export const getPet = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({
      success: 'False',
      message: "Required fields aren't be empty!",
    });
  }

  try {
    const pet = await Pet.findById({ id });

    if (!pet) {
      return res.json({
        success: false,
        message: 'Pet not found! Invalid id',
      });
    }

    return res.json({
      success: false,
      data: pet,
    });
  } catch (error) {
    res.status(504).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getAllPet = async (req, res) => {
  try {
    const pets = await Pet.find({});
    if (!pets) {
      return res.json({
        success: false,
        message: 'Cannot get pets',
      });
    }

    return res.json({
      success: true,
      data: pets,
    });
  } catch (error) {
    return res.json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
