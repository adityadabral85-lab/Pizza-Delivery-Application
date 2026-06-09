import React from 'react';
import { CreditCard, RefreshCw, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { api } from '../lib/api.js';

const categories = ['base', 'sauce', 'cheese', 'veggie', 'meat'];

export default function UserDashboard({ user, logout }) {
  const [catalog, setCatalog] = useState({ varieties: [], inventory: [] });
  const [orders, setOrders] = useState([]);
  const [selection, setSelection] = useState({ veggies: [], meat: [] });
  const [details, setDetails] = useState({ address: '221B Baker Street, Bengaluru', phone: '9999999999' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const grouped = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = catalog.inventory.filter((item) => item.category === category && item.stock > 0);
      return acc;
    }, {});
  }, [catalog.inventory]);

  const total = useMemo(() => {
    const selectedIds = [selection.base, selection.sauce, selection.cheese, ...(selection.veggies || []), ...(selection.meat || [])].filter(Boolean);
    const ingredientTotal = catalog.inventory
      .filter((item) => selectedIds.includes(item._id))
      .reduce((sum, item) => sum + item.price, 149);
    return ingredientTotal;
  }, [catalog.inventory, selection]);

  async function load() {
    setLoading(true);
    try {
      const [catalogData, orderData] = await Promise.all([api('/catalog'), api('/orders/mine')]);
      setCatalog(catalogData);
      setOrders(orderData.orders);
      const byCat = categories.reduce((acc, category) => ({ ...acc, [category]: catalogData.inventory.filter((item) => item.category === category) }), {});
      setSelection({
        base: byCat.base?.[0]?._id,
        sauce: byCat.sauce?.[0]?._id,
        cheese: byCat.cheese?.[0]?._id,
        veggies: byCat.veggie?.slice(0, 2).map((item) => item._id) || [],
        meat: []
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(() => api('/orders/mine').then((data) => setOrders(data.orders)).catch(() => {}), 8000);
    return () => clearInterval(timer);
  }, []);

  function toggleMulti(category, id) {
    const key = category === 'veggie' ? 'veggies' : 'meat';
    const current = selection[key] || [];
    setSelection({ ...selection, [key]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] });
  }

  async function placeOrder() {
    setMessage('');
    if (!selection.base || !selection.sauce || !selection.cheese) {
      setMessage('Please choose a base, sauce, and cheese.');
      return;
    }
    try {
      const payment = await api('/payments/razorpay-order', { method: 'POST', body: { amount: total } });
      const orderData = await api('/orders', {
        method: 'POST',
        body: {
          customPizza: selection,
          address: details.address,
          phone: details.phone,
          payment: {
            razorpayOrderId: payment.order.id,
            razorpayPaymentId: `pay_success_${Date.now()}`
          }
        }
      });
      setOrders([orderData.order, ...orders]);
      setMessage('Payment success. Your pizza order is confirmed.');
      load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (loading) {
    return <main className="appShell"><Header user={user} logout={logout} label="User dashboard" /><p className="loading">Heating the oven...</p></main>;
  }

  return (
    <main className="appShell">
      <Header user={user} logout={logout} label="User dashboard" />
      <section className="dashboardGrid">
        <div className="mainColumn">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">Available today</span>
              <h1>Signature pizzas</h1>
            </div>
            <button className="iconButton" onClick={load} title="Refresh"><RefreshCw size={18} /></button>
          </div>
          <div className="varietyGrid">
            {catalog.varieties.map((pizza) => (
              <article className="pizzaCard" key={pizza._id}>
                <img src={pizza.image} alt={pizza.name} />
                <div>
                  <h3>{pizza.name}</h3>
                  <p>{pizza.description}</p>
                  <strong>₹{pizza.price}</strong>
                </div>
              </article>
            ))}
          </div>
          <section className="builder">
            <div className="sectionHeader">
              <div>
                <span className="eyebrow">Custom pizza</span>
                <h2>Build your own</h2>
              </div>
              <span className="priceTag">₹{total}</span>
            </div>
            <ChoiceGroup title="1. Choose a base" items={grouped.base} selected={selection.base} onPick={(id) => setSelection({ ...selection, base: id })} />
            <ChoiceGroup title="2. Choose a sauce" items={grouped.sauce} selected={selection.sauce} onPick={(id) => setSelection({ ...selection, sauce: id })} />
            <ChoiceGroup title="3. Select cheese" items={grouped.cheese} selected={selection.cheese} onPick={(id) => setSelection({ ...selection, cheese: id })} />
            <ChoiceGroup title="4. Add veggies" items={grouped.veggie} selected={selection.veggies} onPick={(id) => toggleMulti('veggie', id)} multi />
            <ChoiceGroup title="Optional meat" items={grouped.meat} selected={selection.meat} onPick={(id) => toggleMulti('meat', id)} multi />
            <div className="deliveryFields">
              <label>Delivery address<input value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} /></label>
              <label>Phone<input value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} /></label>
            </div>
            <button className="primaryButton" onClick={placeOrder}><CreditCard size={18} /> Pay with Razorpay test</button>
            {message && <p className="message">{message}</p>}
          </section>
        </div>
        <aside className="sidePanel">
          <div className="sectionHeader">
            <h2><ShoppingBag size={20} /> Your orders</h2>
          </div>
          <div className="orderList">
            {orders.map((order) => (
              <article className="orderItem" key={order._id}>
                <div>
                  <strong>Order #{order._id.slice(-6)}</strong>
                  <small>{new Date(order.createdAt).toLocaleString()}</small>
                </div>
                <StatusPill status={order.status} />
                <p>{order.customPizza.base.name}, {order.customPizza.sauce.name}, {order.customPizza.cheese.name}</p>
              </article>
            ))}
            {!orders.length && <p className="muted">No orders yet.</p>}
          </div>
        </aside>
      </section>
    </main>
  );
}

function ChoiceGroup({ title, items = [], selected, onPick, multi = false }) {
  return (
    <div className="choiceGroup">
      <h3>{title}</h3>
      <div className="chips">
        {items.map((item) => {
          const active = multi ? selected?.includes(item._id) : selected === item._id;
          return (
            <button className={active ? 'chip active' : 'chip'} key={item._id} onClick={() => onPick(item._id)}>
              <span>{item.name}</span>
              <small>₹{item.price} · {item.stock} left</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
