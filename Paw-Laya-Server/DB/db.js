const mongoose = require('mongoose');

const connectDB = async (req, res) => {
  //DB USERNAME = teampawlaya
  //DB PASSWORD = DM2KzKueFff3JXvu
  try {
    const connectionUri = process.env.DB_URL;
    mongoose.connect(connectionUri);
    console.log('DataBase conneceted Succesfully');
  } catch (error) {
    console.error('Cannot connet with database', error.message);
  }
};

module.exports = connectDB;
