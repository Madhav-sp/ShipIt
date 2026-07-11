import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Projects", path: "/projects", icon: "folder_open" },
    { name: "Deployments", path: "/deployments", icon: "rocket_launch" },
    { name: "Logs", path: "/logs", icon: "terminal" },
    { name: "Settings", path: "/settings", icon: "settings" },
  ];

  return (
    <aside className="w-sidebar-width h-screen fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant hidden md:flex flex-col py-md px-sm z-50">
      <div className="flex items-center gap-sm px-sm mb-huge">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-background">rocket_launch</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">ShipIt</h1>
          <p className="text-on-surface-variant font-label-md text-label-md">Production Cluster</p>
        </div>
      </div>

      <nav className="flex-1 space-y-xs">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-sm px-sm py-xs rounded-lg font-body-sm text-body-sm cursor-pointer transition-colors duration-200 active:opacity-80 ${
                isActive
                  ? "bg-surface-container-high text-primary font-medium"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-xs pt-md">
        <a href="#" className="flex items-center gap-sm px-sm py-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 font-body-sm text-body-sm">
          <span className="material-symbols-outlined">description</span>
          <span>Docs</span>
        </a>
        <a href="#" className="flex items-center gap-sm px-sm py-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 font-body-sm text-body-sm">
          <span className="material-symbols-outlined">help</span>
          <span>Support</span>
        </a>

        <div className="mt-md px-sm">
          <button className="w-full bg-primary text-background font-label-md text-label-md py-sm px-md rounded-lg font-bold hover:opacity-90 transition-opacity">
            New Deployment
          </button>
        </div>
      </div>
    </aside>
  );
}
