import InventoryItem from '../models/InventoryItem.js';
import { sendLowStockEmail } from './email.js';

export async function decrementInventory(itemIds) {
  const counts = itemIds.reduce((map, id) => {
    const key = id.toString();
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map());

  const changed = [];
  for (const [id, quantity] of counts) {
    const item = await InventoryItem.findById(id);
    if (!item || !item.isActive) {
      throw Object.assign(new Error('Selected ingredient is unavailable'), { status: 400 });
    }
    if (item.stock < quantity) {
      throw Object.assign(new Error(`${item.name} is out of stock`), { status: 400 });
    }
    item.stock -= quantity;
    await item.save();
    changed.push(item);
  }

  await Promise.all(
    changed
      .filter((item) => item.stock < item.threshold)
      .map(async (item) => {
        const last = item.lastLowStockEmailAt?.getTime() || 0;
        if (Date.now() - last > 6 * 60 * 60 * 1000) {
          await sendLowStockEmail(item);
          item.lastLowStockEmailAt = new Date();
          await item.save();
        }
      })
  );
}
