import React from 'react';
import { BrainCircuitIcon, MoonIcon, SunIcon } from './icons/Icons';

interface HeaderProps {
    theme: 'light' | 'dark';
    onThemeChange: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md dark:shadow-black/20 no-print">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <BrainCircuitIcon className="h-8 w-8 text-brand-blue" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              HRD 니즈 진단 시스템
            </h1>
          </div>
           <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">Powered by Gemini</div>
            <button
              onClick={onThemeChange}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;