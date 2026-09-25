import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { AppProvider, AppContext } from "./context/AppContext";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Kasir from "./pages/Kasir";
import Produk from "./pages/Produk";
import Laporan from "./pages/Laporan";
import Login from "./pages/Login";
import Shift from "./pages/Shift";

function MainApp() {
  const { activeShift, isShiftLoading } = useContext(AppContext);

  if (isShiftLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-blue-600">
        Menghubungkan ke sistem kasir...
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-3 md:p-6 pb-24 md:pb-6 h-screen overflow-y-auto w-full relative">
        <Routes>
          <Route path="/shift" element={<Shift />} />

          {/* JIKA SHIFT BELUM DIBUKA: Kunci semua rute selain /shift */}
          {!activeShift ? (
            <Route path="*" element={<Navigate to="/shift" replace />} />
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kasir" element={<Kasir />} />
              <Route path="/produk" element={<Produk />} />
              <Route path="/laporan" element={<Laporan />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-blue-600">
        Memeriksa autentikasi...
      </div>
    );
  }

  return (
    <AppProvider>
      <Router>
        {!session ? (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        ) : (
          <MainApp />
        )}
      </Router>
    </AppProvider>
  );
}