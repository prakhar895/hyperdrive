import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { NavTab } from '../types';

export const Navbar: React.FC = () => {
  const { currentTab, setCurrentTab, setIsReserveModalOpen } = useConfig();

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'showroom', label: 'Showroom' },
    { id: 'configurator', label: 'Configurator' },
    { id: 'performance', label: 'Performance' },
    { id: 'technical', label: 'Technical' },
  ];

  return (
    <header className="bg-background border-b border-outline-variant w-full top-0 sticky z-50 select-none">
      <div className="flex justify-between items-center h-20 px-4 sm:px-8 lg:px-16 w-full max-w-[1440px] mx-auto">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => setCurrentTab('showroom')}
          className="font-headline-md text-2xl sm:text-3xl font-bold tracking-tighter text-primary hover:text-primary-container transition-colors text-left flex items-center gap-2"
          aria-label="HyperDrive Home"
        >
          <span>HYPERDRIVE</span>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex gap-8 font-label-sm text-xs uppercase tracking-widest" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`py-1 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-primary-container border-b-2 border-primary-container font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Reserve CTA */}
        <div className="flex items-center gap-3">
          <button
            id="nav-reserve-btn"
            onClick={() => setIsReserveModalOpen(true)}
            className="font-label-sm text-xs uppercase tracking-widest border border-primary px-5 sm:px-6 py-2 rounded text-primary hover:text-background hover:bg-primary-container hover:border-primary-container transition-all duration-200 active:scale-95"
          >
            RESERVE
          </button>
        </div>
      </div>

      {/* Mobile Sub Navigation Bar */}
      <nav className="flex md:hidden justify-around border-t border-outline-variant bg-surface py-2.5 px-2 font-label-sm text-[11px] tracking-wider uppercase" aria-label="Mobile Navigation">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`px-2 py-1 ${
                isActive ? 'text-primary-container border-b border-primary-container font-bold' : 'text-on-surface-variant'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
