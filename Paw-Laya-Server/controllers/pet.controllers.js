import Pet from '../models/pet.models.js';
import Category from '../models/category.model.js';

const createPet = async (req, res) => {
  try {
    let { name, categoryname, type, gender, price, isVaccinated, isAvailable } =
      req.body;
    categoryname = categoryname.trim().toLowerCase();

    const category = await Category.findOne({ name: categoryname });
    if (!category) {
      const newCategory = new Category({ name: categoryname });
      await newCategory.save();
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Failed to create pet',
      error: error.message,
    });
  }
};

export { createPet };

//admin login create
