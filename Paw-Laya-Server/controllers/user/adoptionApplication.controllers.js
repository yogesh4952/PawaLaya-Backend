import Pet from '../../models/pet.models.js';
import AdoptionApplication from '../../models/adoptionApplication.model.js';

export const applyForAdoption = async (req, res) => {
  const { petId } = req.body;

  try {
    // Check if the pet exists
    const findPet = await Pet.findById(petId);
    if (!findPet) {
      return res.status(404).json({
        message: 'Pet not found',
      });
    }

    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    // Create adoption application
    const application = await AdoptionApplication.create({
      pet: findPet._id, // Store the pet's ID
      user: req.user._id, // Store the user's ID
    });

    return res.status(201).json({
      message: 'Adoption application submitted successfully',
      data: application,
    });
  } catch (error) {
    // Log the error and return a server error response
    console.error('Error in applyForAdoption:', error);
    return res.status(500).json({
      message: 'An error occurred while processing the request',
      error: error.message,
    });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ user: req.user.id })
      .populate('pet', 'name species breed')
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
};

// Update application status (Admin only)

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await AdoptionApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update the application status
    application.status = status;
    await application.save();

    // Mark the pet as adopted if approved
    if (status === 'Approved') {
      const pet = await Pet.findById(application.pet);
      pet.isAdopted = true;
      await pet.save();
    }

    res.status(200).json({
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating application status', error });
  }
};
