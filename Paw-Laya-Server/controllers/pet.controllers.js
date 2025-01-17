import Pet from '../models/pet.models.js';
import Category from '../models/category.model.js';


export const createPet = async (req, res) => {
  try {
    let { name, categoryname, type, gender, price, isVaccinated, isAvailable } =
      req.body;
    categoryname = categoryname.trim().toLowerCase();

    const category = await Category.findOne({ name: categoryname });
    if (!category) {
      const newCategory = new Category({ name: categoryname });
      await newCategory.save();
    }

    const data = new Pet({
      name,
      category,
      type,
      gender,
      price,
      isVaccinated,
      isAvailable,
    });

    try {
      await data.save();
      return res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message: error.message,
        success: false,
        text: 'Cannot save data in db',
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Failed to create pet',
      error: error.message,
    });
  }
};

export const getPet = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({
      success: 'False',
      message: "Required fields aren't be empty!",
    });
  }

  const pet = await Pet.findById({ _id: id });

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
      meassage: error.message,
    });
  }
};
//admin login create
