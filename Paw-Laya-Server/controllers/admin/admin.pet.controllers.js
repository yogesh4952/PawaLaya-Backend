import Pet from '../../models/pet.models.js';

import Category from '../../models/category.model.js';

export const createPet = async (req, res) => {
  try {
    let { name, category, type, gender, price, isVaccinated, isAvailable } =
      req.body;

    category = category.trim();
    console.log(category);

    const categoryType = await Category.findOne({ name: category });
    console.log(categoryType);
    if (!categoryType) {
      const newCategory = new Category({ name: category });
      await newCategory.save();
    }

    const data = new Pet({
      name,
      category: categoryType,
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

export const getAllPet = async (req, res) => {
  try {
    const pets = await Pet.find().populate('category');
    console.log(pets);

    try {
      if (!pets) {
        return res.status(404).json({ message: 'Pets not found' });
      }
      // res.json(pets);
      return res.status(200).json(pets);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPet = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const findPet = await Pet.findOne({ _id: id });
    if (!findPet) {
      return res.status(404).json({
        message: 'Pet not found',
        status: false,
      });
    }
    return res.status(200).json({
      message: 'get pet details succesfull',
      data: findPet,
    });
  } catch (error) {
    res.json(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    const findPet = await Pet.findByIdAndDelete(id);
    if (!findPet) {
      return res.status(404).json({
        message: 'Pet not found',
        status: false,
      });
    }

    return res.status(200).json({
      message: 'Pet deleted successfully!',
      data: findPet,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const updatePet = async (req, res) => {
  const { id } = req.params; // Assuming the ID is passed as a route parameter
  const { name, category, gender, color, price, isVaccinated, isAvailable } =
    req.body;

  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      id, // ID to find the document
      { name, category, gender, color, price, isVaccinated, isAvailable }, // Fields to update
      { new: true } // Return the updated document
    );

    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res
      .status(200)
      .json({ message: 'Pet updated successfully', data: updatedPet });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update pet', error: error.message });
  }
};
