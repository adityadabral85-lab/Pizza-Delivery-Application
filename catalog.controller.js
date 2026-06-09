import InventoryItem from '../models/InventoryItem.js';
import PizzaVariety from '../models/PizzaVariety.js';

export async function getCatalog(_req, res) {
  const [varieties, inventory] = await Promise.all([
    PizzaVariety.find({ isActive: true }).sort('price'),
    InventoryItem.find({ isActive: true }).sort('category name')
  ]);

  res.json({ varieties, inventory });
}
