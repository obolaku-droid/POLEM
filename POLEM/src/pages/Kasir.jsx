import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Kasir() {
  const { products, addTransaction } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  
  // State baru untuk mengontrol tampilan Struk
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  const handleDecreaseQty = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem.qty > 1) {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        );
      } else {
        return prevCart.filter((item) => item.id !== productId);
      }
    });
  };

  const totalHarga = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  const handleCheckout = () => {
    const itemSummary = cart.map(item => `${item.name} (${item.qty})`).join(", ");
    const formattedDate = new Date().toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const newTransaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      date: formattedDate,
      items: itemSummary,
      cartDetails: [...cart], // Menyimpan detail keranjang untuk dicetak
      total: totalHarga
    };

    // 1. Simpan ke Gudang Data
    addTransaction(newTransaction);
    
    // 2. Tampilkan Modal Struk dengan data transaksi barusan
    setReceiptData(newTransaction);
    setShowReceipt(true);
    
    // 3. Kosongkan keranjang untuk transaksi berikutnya
    setCart([]); 
  };

  // Fungsi untuk memicu perintah cetak (print) bawaan browser
  const handlePrint = () => {
    window.print();
  };

  // Fungsi untuk menutup struk dan kembali ke kasir
  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

  return (
    <div className="h-full flex gap-6 relative">
      {/* Sisi Kiri: Katalog Produk (Akan disembunyikan saat di-print) */}
      <div className="flex-1 flex flex-col print:hidden">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Menu Kasir</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleAddToCart(product)}
              className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-500 cursor-pointer transition-all flex flex-col items-center text-center"
            >
              <div className="w-full h-32 mb-3 overflow-hidden rounded-lg bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-gray-700 text-sm">{product.name}</h3>
              <p className="text-blue-600 font-bold mt-1">Rp {product.price.toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sisi Kanan: Keranjang (Akan disembunyikan saat di-print) */}
      <div className="w-[400px] bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full print:hidden">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">Keranjang</h2>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-sm text-red-500 hover:text-red-700 font-semibold">
              Kosongkan
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Belum ada pesanan</div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-gray-800">{item.name}</h4>
                    <div className="font-bold text-gray-800 text-sm">Rp {(item.price * item.qty).toLocaleString("id-ID")}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">@ Rp {item.price.toLocaleString("id-ID")}</p>
                    <div className="flex items-center gap-3 bg-white border rounded-lg px-2 py-1">
                      <button onClick={() => handleDecreaseQty(item.id)} className="text-gray-500 font-bold px-1">-</button>
                      <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => handleAddToCart(item)} className="text-gray-500 font-bold px-1">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-dashed">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-600">Total Tagihan</span>
            <span className="text-2xl font-bold text-blue-600">Rp {totalHarga.toLocaleString("id-ID")}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className={`w-full font-bold py-3 rounded-lg transition-colors shadow-sm ${
              cart.length > 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={cart.length === 0}
          >
            Bayar Pesanan
          </button>
        </div>
      </div>

      {/* MODAL STRUK CETAK */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 print:bg-white print:p-0">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden flex flex-col print:shadow-none print:max-w-full">
            
            {/* Area Kertas Struk */}
            <div className="p-6 bg-white text-gray-800" id="printable-receipt">
              <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 pb-4">
                <h2 className="text-2xl font-black uppercase tracking-wider">Toko Saya</h2>
                <p className="text-sm text-gray-500 mt-1">Jl. Contoh Alamat No. 123</p>
                <p className="text-sm text-gray-500">Telp: 0812-3456-7890</p>
              </div>
              
              <div className="flex justify-between text-sm mb-1 text-gray-600">
                <span>ID Transaksi:</span>
                <span className="font-semibold">{receiptData.id}</span>
              </div>
              <div className="flex justify-between text-sm mb-4 text-gray-600">
                <span>Waktu:</span>
                <span>{receiptData.date}</span>
              </div>

              <div className="border-t-2 border-b-2 border-dashed border-gray-300 py-3 mb-4">
                {receiptData.cartDetails.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-2 last:mb-0">
                    <div className="flex-1">
                      <span className="font-semibold block">{item.name}</span>
                      <span className="text-gray-500">{item.qty} x Rp {item.price.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="font-semibold">
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL</span>
                <span>Rp {receiptData.total.toLocaleString("id-ID")}</span>
              </div>

              <div className="text-center mt-8 pt-4 border-t-2 border-dashed border-gray-300">
                <p className="font-semibold">Terima Kasih!</p>
                <p className="text-sm text-gray-500 mt-1">Silakan berkunjung kembali</p>
              </div>
            </div>

            {/* Tombol Aksi (Akan disembunyikan saat di-print) */}
            <div className="bg-slate-50 p-4 flex gap-3 border-t print:hidden">
              <button 
                onClick={handleCloseReceipt}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
              >
                Tutup
              </button>
              <button 
                onClick={handlePrint}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex justify-center items-center gap-2"
              >
                🖨️ Cetak Struk
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}