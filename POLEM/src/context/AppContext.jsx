import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Membaca data Produk dari Local Storage saat aplikasi pertama kali dimuat
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("app_products");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    // Jika tidak ada data tersimpan, gunakan data default ini
    return [
      { id: 1, name: "Kopi Hitam Tubruk", price: 10000, category: "Minuman", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&h=300&fit=crop" },
      { id: 2, name: "Es Kopi Susu Gula Aren", price: 18000, category: "Minuman", image: "https://images.unsplash.com/photo-1593012920211-137b019b8401?w=300&h=300&fit=crop" },
      { id: 3, name: "Kopi Sanger", price: 15000, category: "Minuman", image: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=300&h=300&fit=crop" },
      { id: 4, name: "Indomie Telur Kornet", price: 14000, category: "Makanan", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop" },
      { id: 5, name: "Roti Bakar Coklat Keju", price: 15000, category: "Makanan", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=300&fit=crop" },
      { id: 6, name: "Es Teh Manis", price: 5000, category: "Minuman", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop" },
    ];
  });

  // 2. Membaca data Transaksi dari Local Storage
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("app_transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // 3. Menyimpan otomatis ke Local Storage setiap kali ada perubahan pada Produk
  useEffect(() => {
    localStorage.setItem("app_products", JSON.stringify(products));
  }, [products]);

  // 4. Menyimpan otomatis ke Local Storage setiap kali ada Transaksi baru
  useEffect(() => {
    localStorage.setItem("app_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTransaction) => {
    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
  };

  return (
    <AppContext.Provider value={{ products, setProducts, transactions, addTransaction }}>
      {children}
    </AppContext.Provider>
  );
}