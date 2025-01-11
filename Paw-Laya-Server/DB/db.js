const mongoose = require('mongoose');

const connectDB = async (req, res) => {
  try {
    const connectionUri = process.env.DB_URL;
    mongoose.connect(connectionUri);
    console.log('DataBase conneceted Succesfully');
  } catch (error) {
    console.error('Cannot connet with database', error.message);
  }
};

module.exports = connectDB;
