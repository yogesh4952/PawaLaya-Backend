import User from '../../models/user.models.js';

export const deleteAll = async (req, res) => {
  try {
    const result = await User.deleteMany({}); // Delete all users

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    res.status(200).json({ message: 'Users deleted successfully' });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.json({
        message: "User doesn't exist.",
      });
    }
    const deleteUser = await User.findByIdAndDelete({ _id: id });
    return res.json({
      message: 'User deleted succesfully',
      data: deleteUser,
    });
  } catch (error) {}
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.json({
        message: 'User not found',
      });
    }

    return res.json({
      message: 'Succesfully get the details',
      data: user,
    });
  } catch (error) {
    return res.json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const data = await User.find({});
    if (!data) {
      return res.json({
        message: 'No user in the database',
      });
    }
    return res.json({
      data,
    });
  } catch (error) {
    return res.json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
