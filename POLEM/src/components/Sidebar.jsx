import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { AppContext } from "../context/AppContext";

export default function Sidebar() {
  const location = useLocation();
  const { activeShift } = useContext(AppContext);
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Shift", path: "/shift", icon: "⏱️" },
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Kasir", path: "/kasir", icon: "🛒" },
    { name: "Produk", path: "/produk", icon: "📦" },
    { name: "Laporan", path: "/laporan", icon: "📝" },
  ];

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      await supabase.auth.signOut();
    }
  };

  return (
    <>
      {/* SIDEBAR KOMPUTER */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r h-screen print:hidden z-10 shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">
            App <span className="text-gray-800">Kasir</span>
          </h1>
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${activeShift ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {activeShift ? "Online" : "Shift Tutup"}
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isLocked = !activeShift && item.path !== "/shift";

            return isLocked ? (
              <div
                key={item.name}
                className="flex items-center justify-between px-4 py-3 rounded-xl font-medium text-gray-300 bg-gray-50 cursor-not-allowed select-none"
                title="Buka shift terlebih dahulu untuk membuka menu ini"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl grayscale opacity-40">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <span className="text-xs">🔒</span>
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <span className="text-xl">🚪</span> Keluar
          </button>
        </div>
      </div>

      {/* MENU BAWAH HP */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-1 z-50 print:hidden shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-safe">
        {menuItems.map((item) => {
          const isLocked = !activeShift && item.path !== "/shift";

          return isLocked ? (
            <div
              key={item.name}
              className="flex flex-col items-center justify-center p-2 min-w-[55px] text-gray-300 opacity-40 cursor-not-allowed select-none"
            >
              <span className="text-lg mb-0.5">🔒</span>
              <span className="text-[9px] font-bold">{item.name}</span>
            </div>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 min-w-[55px] transition-colors ${
                isActive(item.path) ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <span className={`text-xl mb-0.5 ${isActive(item.path) ? "scale-110 transition-transform" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[9px] font-bold">{item.name}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center p-2 min-w-[55px] transition-colors text-red-400"
        >
          <span className="text-xl mb-0.5">🚪</span>
          <span className="text-[9px] font-bold">Keluar</span>
        </button>
      </div>
    </>
  );
}