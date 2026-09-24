import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
  const { transactions, products } = useContext(AppContext);

  const totalPendapatan = transactions.reduce((sum, trx) => sum + trx.total, 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Ringkasan aktivitas penjualan hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-500 font-semibold">Pendapatan Hari Ini</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">Rp {totalPendapatan.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-500 font-semibold">Total Transaksi</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{transactions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-500 font-semibold">Produk Aktif</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{products.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Transaksi Terakhir</h3>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p>Belum ada data transaksi yang tersimpan.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.slice(0, 5).map((trx) => (
              <div key={trx.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <h4 className="font-semibold text-gray-800">{trx.id}</h4>
                  <p className="text-xs text-gray-500">{trx.date} • {trx.items}</p>
                </div>
                <div className="font-bold text-green-600">+ Rp {trx.total.toLocaleString("id-ID")}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}