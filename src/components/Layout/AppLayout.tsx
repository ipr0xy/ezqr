import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-[100dvh] shadow-lg relative pb-20">
        <Outlet />
        <Navigation />
      </div>
    </div>
  );
};