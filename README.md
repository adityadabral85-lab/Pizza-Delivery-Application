# Pizza Delivery Application

A full-stack pizza delivery application built with React, Node.js, Express, and MongoDB.

## Features

- User and admin registration/login
- JWT authentication and role-based authorization
- Email verification and forgot password flow
- Pizza builder with base, sauce, cheese, veggies, and meat options
- Razorpay test checkout order flow
- Admin inventory management
- Stock updates after orders
- Low-stock email notification trigger
- Admin order status updates
- User dashboard reflects live order status after refresh

## Project Structure

```text
pizza-delivery-application/
  client/
    src/
      api/
      components/
      context/
      pages/
  server/
    src/
      config/
      middleware/
      models/
      routes/
      utils/
```

## Setup

1. Install dependencies.

```bash
cd server
npm install
cd ../client
npm install
```

2. Create `server/.env` from `server/.env.example`.

3. Start the backend.

```bash
cd server
npm run dev
```

4. Start the frontend in a second terminal.

```bash
cd client
npm run dev
```

## Default Admin

Register a user normally, then change their role to `admin` in MongoDB.

## Razorpay

This project includes Razorpay order creation in test mode. Add your Razorpay test keys to `server/.env`.

## Push to GitHub

```bash
git init
git add .
git commit -m "Add pizza delivery application"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

