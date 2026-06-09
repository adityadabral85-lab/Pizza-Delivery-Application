import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDb } from './config/db.js';
import InventoryItem from './models/InventoryItem.js';
import PizzaVariety from './models/PizzaVariety.js';
import User from './models/User.js';

const inventory = [
  ['Classic Hand Tossed', 'base', 75, 20, 80],
  ['Thin Crust', 'base', 70, 20, 90],
  ['Cheese Burst', 'base', 60, 20, 130],
  ['Whole Wheat', 'base', 55, 20, 95],
  ['Gluten Free', 'base', 45, 20, 140],
  ['Tomato Basil', 'sauce', 80, 20, 35],
  ['Smoky Barbecue', 'sauce', 65, 20, 45],
  ['Pesto Verde', 'sauce', 45, 15, 55],
  ['Spicy Schezwan', 'sauce', 70, 20, 40],
  ['Garlic Alfredo', 'sauce', 50, 15, 55],
  ['Mozzarella', 'cheese', 90, 20, 70],
  ['Cheddar', 'cheese', 70, 20, 65],
  ['Parmesan', 'cheese', 45, 15, 85],
  ['Vegan Cheese', 'cheese', 35, 10, 95],
  ['Four Cheese Blend', 'cheese', 50, 15, 110],
  ['Onion', 'veggie', 120, 25, 15],
  ['Capsicum', 'veggie', 100, 25, 18],
  ['Mushroom', 'veggie', 85, 20, 25],
  ['Sweet Corn', 'veggie', 95, 20, 20],
  ['Jalapeno', 'veggie', 70, 15, 22],
  ['Olives', 'veggie', 60, 15, 30],
  ['Tomato', 'veggie', 110, 25, 16],
  ['Paneer', 'veggie', 55, 15, 45],
  ['Pepperoni', 'meat', 55, 15, 75],
  ['Grilled Chicken', 'meat', 65, 15, 80],
  ['Chicken Sausage', 'meat', 50, 15, 70]
].map(([name, category, stock, threshold, price]) => ({ name, category, stock, threshold, price }));

const varieties = [
  {
    name: 'Margherita Glow',
    description: 'Tomato basil sauce, mozzarella, and fresh tomato on a hand tossed base.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80',
    tags: ['classic', 'veg']
  },
  {
    name: 'Smoky Feast',
    description: 'Barbecue sauce, cheddar, onion, capsicum, and grilled chicken.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    tags: ['bbq', 'chicken']
  },
  {
    name: 'Garden Crunch',
    description: 'Pesto, vegan cheese, mushroom, corn, olives, and jalapeno.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=80',
    tags: ['vegan', 'loaded']
  }
];

async function seed() {
  await connectDb();
  await Promise.all([InventoryItem.deleteMany({}), PizzaVariety.deleteMany({}), User.deleteMany({})]);

  await InventoryItem.insertMany(inventory);
  await PizzaVariety.insertMany(varieties);

  await User.create([
    {
      name: 'PizzaCraft Admin',
      email: 'admin@pizzacraft.local',
      password: 'Admin@12345',
      role: 'admin',
      isEmailVerified: true
    },
    {
      name: 'Demo User',
      email: 'user@pizzacraft.local',
      password: 'User@12345',
      role: 'user',
      isEmailVerified: true
    }
  ]);

  console.log('Seed complete.');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
