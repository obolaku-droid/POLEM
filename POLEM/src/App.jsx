import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Kasir from "./pages/Kasir";
import Produk from "./pages/Produk";
import Laporan from "./pages/Laporan";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <Router>
        {/* Kontainer Utama */}
        <div className="flex bg-slate-50 min-h-screen">
          <Sidebar />
          
          {/* 
            Area Konten Utama: 
            pb-24 = Padding bawah untuk HP (agar tidak tertutup Bottom Navigation)
            md:pb-6 = Padding normal untuk komputer
          */}
          <main className="flex-1 p-3 md:p-6 pb-24 md:pb-6 h-screen overflow-y-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kasir" element={<Kasir />} />
              <Route path="/produk" element={<Produk />} />
              <Route path="/laporan" element={<Laporan />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}