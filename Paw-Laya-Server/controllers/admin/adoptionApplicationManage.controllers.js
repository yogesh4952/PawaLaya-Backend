import AdoptionApplication from '../../models/adoptionApplication.model.js';

export const getAllApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const findApplication = await AdoptionApplication.findById(id);
    if (!findApplication) {
      return res.status(404).json({
        message: 'No aaplication submited yet',
      });
    }

    return res.status.json({
      message: 'Applications fetched succesfully',
      data: findApplication,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
