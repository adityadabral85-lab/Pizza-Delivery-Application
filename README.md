# Pizza Delivery Application

Full-stack pizza delivery app built with React, Node.js, Express, MongoDB, and Razorpay test checkout.

## Live Demo

### Admin Dashboard

![PizzaCraft admin dashboard](docs/screenshots/admin-dashboard.png)

### Login Page

![PizzaCraft login page](docs/screenshots/login-page.png)

## Features

- User and admin registration/login with JWT authorization
- Email verification and forgot-password token flow
- User dashboard with pizza catalog and custom pizza builder
- Five bases, five sauces, cheese, veggies, and meat inventory
- Razorpay test-order creation plus local success confirmation
- Admin inventory dashboard with threshold alerts by email
- Admin order status updates reflected in user dashboard

## Run Locally

1. Install dependencies:

```bash
npm run install:all
```

2. Copy environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Start MongoDB locally or set `MONGO_URI` in `server/.env`.

4. Seed inventory and demo accounts:

```bash
npm run seed
```

5. Start both apps:

```bash
npm run dev
```

Frontend: http://localhost:4173

Backend: http://localhost:5000

## Demo Accounts

- Admin: `admin@pizzacraft.local` / `Admin@12345`
- User: `user@pizzacraft.local` / `User@12345`

Emails are printed to the server console unless SMTP credentials are configured.
