import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Laporan() {
  const { transactions } = useContext(AppContext);
  const totalPendapatan = transactions.reduce((sum, trx) => sum + trx.total, 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan Penjualan</h2>
          <p className="text-gray-500 text-sm mt-1">Pantau riwayat transaksi harian.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Riwayat Transaksi</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-gray-600 uppercase text-xs leading-normal border-y border-gray-200">
                <th className="py-3 px-6 font-bold">ID Transaksi</th>
                <th className="py-3 px-6 font-bold">Waktu</th>
                <th className="py-3 px-6 font-bold w-1/3">Item Terjual</th>
                <th className="py-3 px-6 font-bold text-right">Total Pembayaran</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {transactions.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-gray-400">Belum ada data transaksi.</td></tr>
              ) : (
                transactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">{trx.id}</td>
                    <td className="py-3 px-6">{trx.date}</td>
                    <td className="py-3 px-6 text-gray-500">{trx.items}</td>
                    <td className="py-3 px-6 font-bold text-green-600 text-right">Rp {trx.total.toLocaleString("id-ID")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-w-[250px] flex justify-between font-bold text-gray-800">
            <span>Total Pendapatan:</span>
            <span className="text-xl text-blue-600">Rp {totalPendapatan.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}