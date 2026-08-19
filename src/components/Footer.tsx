import React from 'react';
import { useConfig } from '../context/ConfigContext';

export const Footer: React.FC = () => {
  const { setCurrentTab } = useConfig();

  return (
    <footer className="w-full bg-background border-t border-outline-variant py-10 px-4 sm:px-8 lg:px-16 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="font-headline-md text-2xl font-bold tracking-tighter text-primary">
          HYPERDRIVE
        </div>

        {/* Legal & Policy Links */}
        <div className="flex flex-wrap justify-center gap-6 font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
          <button
            id="footer-privacy-btn"
            onClick={() => setCurrentTab('privacy')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            id="footer-terms-btn"
            onClick={() => setCurrentTab('terms')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            id="footer-legal-btn"
            onClick={() => setCurrentTab('legal')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Legal
          </button>
        </div>

        {/* Copyright */}
        <div className="font-label-sm text-[11px] text-outline uppercase tracking-widest text-center md:text-right">
          © 2026 HYPERDRIVE ENGINEERING. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
