import React from 'react';
import { ClipboardList, Package, RefreshCw, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { api } from '../lib/api.js';

const statuses = ['Order received', 'In the kitchen', 'Sent to delivery'];

export default function AdminDashboard({ user, logout }) {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  const lowStock = useMemo(() => inventory.filter((item) => item.stock < item.threshold), [inventory]);

  async function load() {
    try {
      const [inventoryData, orderData] = await Promise.all([api('/inventory'), api('/orders')]);
      setInventory(inventoryData.items);
      setOrders(orderData.orders);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

  function editItem(id, patch) {
    setInventory((items) => items.map((item) => (item._id === id ? { ...item, ...patch } : item)));
  }

  async function saveItem(item) {
    try {
      const data = await api(`/inventory/${item._id}`, { method: 'PUT', body: item });
      editItem(item._id, data.item);
      setMessage(`${item.name} updated`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function changeStatus(orderId, status) {
    try {
      const data = await api(`/orders/${orderId}/status`, { method: 'PUT', body: { status } });
      setOrders((items) => items.map((order) => (order._id === orderId ? data.order : order)));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="appShell">
      <Header user={user} logout={logout} label="Admin dashboard" />
      <section className="adminHero">
        <div>
          <span className="eyebrow">Operations</span>
          <h1>Kitchen command center</h1>
          <p>Track incoming orders, ingredient levels, and low-stock email triggers.</p>
        </div>
        <button className="iconButton" onClick={load} title="Refresh"><RefreshCw size={18} /></button>
      </section>
      {message && <p className="message">{message}</p>}
      <section className="metricRow">
        <Metric label="Orders" value={orders.length} icon={<ClipboardList size={20} />} />
        <Metric label="Inventory items" value={inventory.length} icon={<Package size={20} />} />
        <Metric label="Low stock" value={lowStock.length} icon={<Package size={20} />} />
      </section>
      <section className="adminGrid">
        <div>
          <div className="sectionHeader">
            <h2>Inventory</h2>
          </div>
          <div className="inventoryTable">
            <div className="tableHead">
              <span>Item</span><span>Category</span><span>Stock</span><span>Threshold</span><span>Price</span><span></span>
            </div>
            {inventory.map((item) => (
              <div className={item.stock < item.threshold ? 'tableRow low' : 'tableRow'} key={item._id}>
                <strong>{item.name}</strong>
                <span>{item.category}</span>
                <input type="number" value={item.stock} onChange={(e) => editItem(item._id, { stock: Number(e.target.value) })} />
                <input type="number" value={item.threshold} onChange={(e) => editItem(item._id, { threshold: Number(e.target.value) })} />
                <input type="number" value={item.price} onChange={(e) => editItem(item._id, { price: Number(e.target.value) })} />
                <button className="iconButton" onClick={() => saveItem(item)} title="Save"><Save size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        <aside className="sidePanel">
          <div className="sectionHeader"><h2>Orders</h2></div>
          <div className="orderList">
            {orders.map((order) => (
              <article className="orderItem" key={order._id}>
                <div>
                  <strong>#{order._id.slice(-6)} · {order.user.name}</strong>
                  <small>₹{order.totalAmount} · {order.phone}</small>
                </div>
                <StatusPill status={order.status} />
                <p>{order.customPizza.base.name}, {order.customPizza.sauce.name}, {order.customPizza.cheese.name}</p>
                <select value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value, icon }) {
  return (
    <article className="metric">
      {icon}
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}
