import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Import komponen & halaman
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Kasir from "./pages/Kasir";
import Produk from "./pages/Produk";
import Laporan from "./pages/Laporan";
import Login from "./pages/Login";
import Shift from "./pages/Shift"; // Import halaman Shift
import { AppProvider } from "./context/AppContext";

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek status login saat aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Dengarkan perubahan (misal: saat login atau logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tampilkan layar loading sebentar saat memeriksa status login
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-blue-500">Memeriksa akses...</div>;
  }

  return (
    <AppProvider>
      <Router>
        {/* JIKA BELUM LOGIN: Hanya tampilkan halaman Login */}
        {!session ? (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        ) : (
          /* JIKA SUDAH LOGIN: Tampilkan menu utama aplikasi Kasir */
          <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            
            <main className="flex-1 p-3 md:p-6 pb-24 md:pb-6 h-screen overflow-y-auto w-full relative">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/shift" element={<Shift />} /> {/* RUTE SHIFT YANG BENAR */}
                <Route path="/kasir" element={<Kasir />} />
                <Route path="/produk" element={<Produk />} />
                <Route path="/laporan" element={<Laporan />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        )}
      </Router>
    </AppProvider>
  );
}