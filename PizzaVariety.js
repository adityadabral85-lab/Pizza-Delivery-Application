import mongoose from 'mongoose';

const pizzaVarietySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    tags: [String],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('PizzaVariety', pizzaVarietySchema);
