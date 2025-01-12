import User from '../models/user.models.js';

const deleteUser = async (req, res) => {
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

export default deleteUser;
