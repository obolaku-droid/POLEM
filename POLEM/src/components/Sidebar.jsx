import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Kasir", path: "/kasir", icon: "🛒" },
    { name: "Produk", path: "/produk", icon: "📦" },
    { name: "Laporan", path: "/laporan", icon: "📝" },
  ];

  return (
    <>
      {/* SIDEBAR UNTUK KOMPUTER (Akan otomatis disembunyikan di layar HP oleh kelas 'hidden md:flex') */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r h-screen print:hidden z-10 shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">App <span className="text-gray-800">Kasir</span></h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive(item.path) ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* MENU BAWAH KHUSUS HP (Akan muncul di HP dan hilang di komputer berkat kelas 'md:hidden') */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-2 z-50 print:hidden shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-safe">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 w-16 transition-colors ${
              isActive(item.path) ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <span className={`text-2xl mb-1 ${isActive(item.path) ? 'scale-110 transition-transform' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}