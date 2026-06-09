import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDb } from './config/db.js';

const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(port, () => console.log(`PizzaCraft API running on port ${port}`));
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });
