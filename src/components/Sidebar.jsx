import { NavLink } from 'react-router-dom';
import { FiGrid, FiPackage, FiPlus, FiDatabase, FiSettings } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: FiGrid },
  { to: '/products', label: 'Products', icon: FiPackage },
  { to: '/products/add', label: 'Add', icon: FiPlus, isPrimary: true },
  { to: '/import', label: 'Backup', icon: FiDatabase },
  { to: '/settings', label: 'Settings', icon: FiSettings }
];

export default function Sidebar() {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-1.5 py-1.5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95">
      <div className="grid grid-cols-5 items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[10px] font-bold transition ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/30">
                  <Icon className="text-xl" />
                </div>
                <span>{item.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 rounded-2xl py-2 px-1 text-[10px] font-semibold transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-slate-900 dark:text-brand-300 font-bold'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'
                }`
              }
            >
              <Icon className="text-lg" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
