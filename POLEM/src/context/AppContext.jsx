import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi mengambil produk
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil produk:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi mengambil riwayat transaksi
  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase.from('transactions').select('*').order('id', { ascending: false });
      if (error) throw error;
      if (data) setTransactions(data);
    } catch (error) {
      console.error("Gagal mengambil transaksi:", error.message);
    }
  };

  // Panggil kedua fungsi saat aplikasi pertama kali dimuat
  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  return (
    <AppContext.Provider 
      value={{ 
        products, 
        fetchProducts, 
        loading, 
        transactions, 
        fetchTransactions 
      }}
    >
      {children}
    </AppContext.Provider>
  );
}