import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 relative text-scaled">
      {/* Subtle ambient glow for the dashboard */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-indigo-500/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[280px] w-[500px] h-[300px] bg-violet-500/[0.02] rounded-full blur-3xl" />
      </div>
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen relative">
        <div className="max-w-7xl mx-auto px-6 py-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
