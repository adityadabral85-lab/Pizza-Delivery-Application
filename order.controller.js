import InventoryItem from '../models/InventoryItem.js';
import Order from '../models/Order.js';
import { decrementInventory } from '../utils/inventory.js';

const populatePizza = [
  { path: 'customPizza.base' },
  { path: 'customPizza.sauce' },
  { path: 'customPizza.cheese' },
  { path: 'customPizza.veggies' },
  { path: 'customPizza.meat' },
  { path: 'user', select: 'name email' }
];

async function calculateTotal(customPizza) {
  const ids = [
    customPizza.base,
    customPizza.sauce,
    customPizza.cheese,
    ...(customPizza.veggies || []),
    ...(customPizza.meat || [])
  ];
  const items = await InventoryItem.find({ _id: { $in: ids }, isActive: true });
  if (items.length !== new Set(ids.map(String)).size) {
    throw Object.assign(new Error('One or more selected ingredients are unavailable'), { status: 400 });
  }
  return items.reduce((sum, item) => sum + item.price, 149);
}

export async function createOrder(req, res) {
  const { customPizza, payment, address, phone } = req.body;
  const totalAmount = await calculateTotal(customPizza);
  const ingredientIds = [
    customPizza.base,
    customPizza.sauce,
    customPizza.cheese,
    ...(customPizza.veggies || []),
    ...(customPizza.meat || [])
  ];

  await decrementInventory(ingredientIds);

  const order = await Order.create({
    user: req.user._id,
    customPizza,
    totalAmount,
    payment: {
      razorpayOrderId: payment?.razorpayOrderId,
      razorpayPaymentId: payment?.razorpayPaymentId || `pay_test_${Date.now()}`,
      status: 'paid'
    },
    address,
    phone
  });

  const populated = await Order.findById(order._id).populate(populatePizza);
  res.status(201).json({ order: populated });
}

export async function myOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt').populate(populatePizza);
  res.json({ orders });
}

export async function allOrders(_req, res) {
  const orders = await Order.find().sort('-createdAt').populate(populatePizza);
  res.json({ orders });
}

export async function updateOrderStatus(req, res) {
  const allowed = ['Order received', 'In the kitchen', 'Sent to delivery'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate(populatePizza);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
}
