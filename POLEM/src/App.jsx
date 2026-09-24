import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Kasir from "./pages/Kasir";
import Produk from "./pages/Produk";
import Laporan from "./pages/Laporan";

// Import AppProvider yang baru saja kita buat
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kasir" element={<Kasir />} />
              <Route path="/produk" element={<Produk />} />
              <Route path="/laporan" element={<Laporan />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;