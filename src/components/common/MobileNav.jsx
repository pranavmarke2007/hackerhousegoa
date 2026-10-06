import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Flame, 
  Code2, 
  Target, 
  BarChart3,
  Settings
} from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/college', label: 'College', icon: GraduationCap },
  { path: '/habits', label: 'Habits', icon: Flame },
  { path: '/skills', label: 'Skills', icon: Code2 },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/progress', label: 'Stats', icon: BarChart3 },
];

export default function MobileNav() {
  return (
    <nav className="mobile-bottom-nav">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
