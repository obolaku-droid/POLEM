import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Laporan() {
  const { transactions } = useContext(AppContext);

  // Hitung total pendapatan keseluruhan
  const totalPendapatan = transactions.reduce((sum, trx) => sum + trx.total, 0);

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan Penjualan</h2>
      
      {/* Kartu Ringkasan Pendapatan */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-2">
        <span className="font-semibold text-blue-800 text-center md:text-left">Total Pendapatan Keseluruhan</span>
        <span className="text-2xl font-extrabold text-blue-700">Rp {totalPendapatan.toLocaleString("id-ID")}</span>
      </div>

      {/* Tabel Riwayat Transaksi */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-sm font-semibold text-gray-600">ID Transaksi</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Tanggal</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Item</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Pembayaran</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">Belum ada transaksi.</td>
              </tr>
            ) : (
              transactions.map((trx) => (
                <tr key={trx.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-sm text-gray-700 font-medium">{trx.trx_id}</td>
                  <td className="p-3 text-sm text-gray-500">{trx.date}</td>
                  <td className="p-3 text-sm text-gray-600">{trx.items}</td>
                  
                  {/* KOLOM BARU: METODE PEMBAYARAN */}
                  <td className="p-3 text-sm text-gray-600 font-semibold">
                    {trx.payment_method === 'QRIS' ? '📱 QRIS' : 
                     trx.payment_method === 'Transfer Bank' ? '🏦 Transfer' : '💵 Tunai'}
                  </td>
                  
                  <td className="p-3 text-sm text-gray-800 font-bold">Rp {trx.total.toLocaleString("id-ID")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}