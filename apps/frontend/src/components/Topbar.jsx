import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Topbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b border-outline-variant flex items-center justify-between px-lg w-full">
      <div className="flex items-center gap-md lg:hidden">
         {/* Hamburger menu placeholder for mobile */}
         <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">menu</button>
      </div>

      <div className="hidden lg:flex items-center gap-md">
        <nav className="flex items-center gap-sm text-on-surface-variant font-label-md text-label-md">
          <span>ShipIt</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">Projects</span>
        </nav>
      </div>

      <div className="flex-1 max-w-md mx-xl hidden md:block">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-xs pl-xl pr-sm text-body-sm focus:outline-none focus:border-outline transition-colors text-on-surface"
            placeholder="Search projects or deployments..."
            type="text"
          />
          <div className="absolute right-sm top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant border border-outline-variant px-xs rounded">⌘ K</div>
        </div>
      </div>

      <div className="flex items-center gap-md relative">
        <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors">notifications</button>
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant focus:outline-none focus:border-primary"
            >
              {user.photos && user.photos[0] ? (
                 <img className="w-full h-full object-cover" alt="Avatar" src={user.photos[0].value} />
              ) : (
                 <span className="material-symbols-outlined text-on-surface-variant text-[20px] mt-1">person</span>
              )}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-low border border-outline-variant rounded-lg shadow-xl overflow-hidden py-xs">
                <div className="px-md py-sm border-b border-outline-variant">
                  <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{user.username || user.displayName || 'User'}</p>
                </div>
                <button onClick={logout} className="w-full text-left px-md py-sm font-label-md text-label-md text-red-400 hover:bg-surface-container-highest transition-colors">
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant animate-pulse"></div>
        )}
      </div>
    </header>
  );
}
