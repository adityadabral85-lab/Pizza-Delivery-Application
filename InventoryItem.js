import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
      required: true
    },
    stock: { type: Number, default: 0, min: 0 },
    threshold: { type: Number, default: 20, min: 0 },
    price: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'portion' },
    isActive: { type: Boolean, default: true },
    lastLowStockEmailAt: Date
  },
  { timestamps: true }
);

inventoryItemSchema.index({ name: 1, category: 1 }, { unique: true });

export default mongoose.model('InventoryItem', inventoryItemSchema);
