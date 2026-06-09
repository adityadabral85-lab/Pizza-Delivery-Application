import InventoryItem from '../models/InventoryItem.js';

export async function listInventory(_req, res) {
  const items = await InventoryItem.find().sort('category name');
  res.json({ items });
}

export async function upsertInventory(req, res) {
  const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) return res.status(404).json({ message: 'Inventory item not found' });
  res.json({ item });
}

export async function createInventory(req, res) {
  const item = await InventoryItem.create(req.body);
  res.status(201).json({ item });
}
