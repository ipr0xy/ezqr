import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, User, Plus } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/items/create', icon: Plus, label: 'Create' },
  { path: '/items', icon: Package, label: 'QR Codes' },
  { path: '/profile', icon: User, label: 'About' }
] as const;

export const Navigation: React.FC = memo(() => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              aria-label={label}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';