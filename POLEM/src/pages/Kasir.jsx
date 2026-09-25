import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { supabase } from "../supabaseClient";

export default function Kasir() {
  const { products, fetchTransactions } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State baru untuk menyimpan metode pembayaran yang dipilih
  const [paymentMethod, setPaymentMethod] = useState("Tunai");

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    setIsProcessing(true);

    const newTransaction = {
      trx_id: `TRX-${Date.now()}`,
      date: new Date().toLocaleString("id-ID"),
      items: cart.map(item => `${item.name} (x${item.qty})`).join(", "),
      total: total,
      cart_details: cart,
      payment_method: paymentMethod // Menyimpan metode pembayaran ke Supabase
    };

    try {
      const { error } = await supabase.from('transactions').insert([newTransaction]);
      if (error) throw error;

      alert(`Pembayaran ${paymentMethod} berhasil diproses!`);
      
      window.print();
      
      setCart([]);
      setPaymentMethod("Tunai"); // Kembalikan ke default setelah bayar
      fetchTransactions(); 
    } catch (error) {
      console.error(error);
      alert("Gagal memproses transaksi: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full print:bg-white print:p-0">
      
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Kasir</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length === 0 ? (
             <p className="text-gray-500 col-span-full">Belum ada produk. Tambahkan di menu Produk.</p>
          ) : (
            products.map(product => (
              <div key={product.id} onClick={() => addToCart(product)} className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-blue-400 transition-all bg-slate-50">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md mb-3 bg-white" />
                <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-blue-600 font-bold text-sm">Rp {product.price.toLocaleString("id-ID")}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col print:w-full print:border-none print:shadow-none print:p-0">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Pesanan Saat Ini</h2>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 border-t border-b py-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-400 mt-10 print:hidden">Keranjang kosong</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-gray-500 text-sm">Rp {item.price.toLocaleString("id-ID")} x {item.qty}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xl font-bold hover:text-red-700 print:hidden">×</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2">
          {/* BAGIAN BARU: Pilihan Metode Pembayaran */}
          <div className="mb-4 print:hidden">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-gray-700"
            >
              <option value="Tunai">💵 Tunai (Cash)</option>
              <option value="QRIS">📱 QRIS (myBCA / Gopay / dll)</option>
              <option value="Transfer Bank">🏦 Transfer Bank</option>
            </select>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-gray-600">Total Tagihan</span>
            <span className="text-2xl font-extrabold text-blue-600">Rp {total.toLocaleString("id-ID")}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full py-3 rounded-lg font-bold text-white text-lg transition-colors print:hidden ${cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} ${isProcessing ? 'opacity-70' : ''}`}
          >
            {isProcessing ? "Memproses..." : `Bayar ${paymentMethod}`}
          </button>
        </div>
      </div>
    </div>
  );
}