import { FiMoon, FiSun, FiBox } from 'react-icons/fi';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/25">
            <FiBox className="text-lg" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              Inventory App
            </h1>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Offline Local Storage
            </p>
          </div>
        </div>

        <button
          className="btn-secondary rounded-full p-2 text-slate-600 dark:text-slate-300"
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
        >
          {darkMode ? <FiSun className="text-amber-400 text-lg" /> : <FiMoon className="text-slate-700 text-lg" />}
        </button>
      </div>
    </header>
  );
}
