import React from 'react';

const navItems = [
  { label: 'Главная', screen: 'home' },
  { label: 'Запись', screen: 'book' },
  { label: 'Галерея', screen: 'gallery' },
];

function BottomNav({ screen, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {navItems.map((item) => (
        <button
          key={item.label}
          className={`nav-item ${screen === item.screen ? 'active' : ''}`}
          type="button"
          onClick={() => onNavigate(item.screen)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
