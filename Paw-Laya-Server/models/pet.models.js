// import { Boolean, Number, ref, required, String } from 'joi';
import mongoose from 'mongoose';

const PetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must provide name'],
      minlength: 2,
    },

    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Category',
    },

    gender: {
      type: String,
      enum: ['M', 'F'],
      required: true,
    },

    color: {
      type: String,
    },

    price: {
      type: String,
      default: '0',
    },

    isVaccinated: {
      type: Boolean,
      required: true,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Pet = mongoose.model('Pet', PetSchema);

export default Pet;
