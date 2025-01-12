// import { expression, string } from 'joi';
import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
