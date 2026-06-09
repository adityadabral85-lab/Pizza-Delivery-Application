import mongoose from 'mongoose';

const customPizzaSchema = new mongoose.Schema(
  {
    base: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    sauce: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    cheese: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    veggies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }],
    meat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }]
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customPizza: { type: customPizzaSchema, required: true },
    totalAmount: { type: Number, required: true },
    payment: {
      provider: { type: String, default: 'razorpay' },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' }
    },
    status: {
      type: String,
      enum: ['Order received', 'In the kitchen', 'Sent to delivery'],
      default: 'Order received'
    },
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
