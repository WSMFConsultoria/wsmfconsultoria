import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BudgetModal from '../ui/BudgetModal';

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between selection:bg-secondary selection:text-white" id="root-container">
      {/* Header section with routing */}
      <Header />

      {/* Main page content area */}
      <main className="flex-grow flex flex-col w-full" id="main-content">
        <Outlet />
      </main>

      {/* Footer quick links and brand details */}
      <Footer />

      {/* Interactive budget proposal requesting modal */}
      <BudgetModal />


    </div>
  );
}
