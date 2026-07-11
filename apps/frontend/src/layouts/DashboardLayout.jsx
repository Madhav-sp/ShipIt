import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-on-background selection:bg-primary selection:text-background">
      <Sidebar />
      <main className="w-full md:ml-sidebar-width flex-1 min-h-screen flex flex-col transition-all">
        <Topbar />
        <div className="flex-1 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
