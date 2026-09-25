import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeShift, setActiveShift] = useState(null);
  const [isShiftLoading, setIsShiftLoading] = useState(true);

  // Ambil data produk
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (!error && data) setProducts(data);
  };

  // Ambil data transaksi
  const fetchTransactions = async () => {
    const { data, error } = await supabase.from("transactions").select("*").order("id", { ascending: false });
    if (!error && data) setTransactions(data);
  };

  // Ambil status shift aktif
  const fetchActiveShift = async () => {
    try {
      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("status", "buka")
        .limit(1);

      if (!error && data && data.length > 0) {
        setActiveShift(data[0]);
      } else {
        setActiveShift(null);
      }
    } catch (err) {
      console.error(err);
      setActiveShift(null);
    } finally {
      setIsShiftLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
    fetchActiveShift();
  }, []);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        fetchProducts,
        transactions,
        fetchTransactions,
        activeShift,
        fetchActiveShift,
        isShiftLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}