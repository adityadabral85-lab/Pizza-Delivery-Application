import React from 'react';
import { LogOut, Pizza } from 'lucide-react';

export default function Header({ user, logout, label }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brandMark"><Pizza size={24} /></span>
        <div>
          <strong>PizzaCraft</strong>
          <small>{label}</small>
        </div>
      </div>
      <div className="profile">
        <span>{user.name}</span>
        <button className="iconButton" onClick={logout} title="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
