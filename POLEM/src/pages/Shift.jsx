import { useState, useContext } from "react";
import { supabase } from "../supabaseClient";
import { AppContext } from "../context/AppContext";

export default function Shift() {
  const { activeShift, fetchActiveShift, isShiftLoading } = useContext(AppContext);
  const [saldoAwal, setSaldoAwal] = useState("");
  const [saldoAkhir, setSaldoAkhir] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBukaShift = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("shifts").insert([
        {
          waktu_buka: new Date().toLocaleString("id-ID"),
          saldo_awal: parseInt(saldoAwal),
          status: "buka",
        },
      ]);

      if (error) throw error;
      alert("Shift berhasil dibuka! Menu kasir sekarang aktif.");
      await fetchActiveShift();
      setSaldoAwal("");
    } catch (error) {
      alert("Gagal membuka shift: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTutupShift = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("shifts")
        .update({
          waktu_tutup: new Date().toLocaleString("id-ID"),
          saldo_akhir: parseInt(saldoAkhir),
          status: "tutup",
        })
        .eq("id", activeShift.id);

      if (error) throw error;
      alert("Shift berhasil ditutup! Menu kasir kembali dikunci.");
      await fetchActiveShift();
      setSaldoAkhir("");
    } catch (error) {
      alert("Gagal menutup shift: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isShiftLoading) {
    return <div className="p-6 text-center font-semibold text-gray-500">Memeriksa status shift...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 mt-4 md:mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Manajemen Shift Kasir</h2>

      {!activeShift ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <span className="text-5xl block mb-3">🔒</span>
          <h3 className="text-xl font-bold text-amber-800">Kasir Sedang Terkunci</h3>
          <p className="text-amber-700 text-sm mt-1 mb-6">
            Masukkan modal awal laci kasir untuk membuka shift dan mengakses transaksi.
          </p>

          <form onSubmit={handleBukaShift} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Modal Awal di Laci (Rp)</label>
              <input
                type="number"
                value={saldoAwal}
                onChange={(e) => setSaldoAwal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Misal: 200000"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Membuka..." : "Buka Shift & Aktifkan Menu"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="text-center mb-6">
            <span className="text-5xl block mb-2">🔓</span>
            <h3 className="text-xl font-bold text-emerald-800">Shift Aktif</h3>
            <p className="text-emerald-700 text-xs mt-1">Dibuka sejak: {activeShift.waktu_buka}</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6 text-center border border-emerald-100">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Modal Awal</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">
              Rp {Number(activeShift.saldo_awal).toLocaleString("id-ID")}
            </p>
          </div>

          <form onSubmit={handleTutupShift} className="space-y-4 border-t border-emerald-200 pt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Fisik Uang di Laci Saat Ini (Rp)</label>
              <input
                type="number"
                value={saldoAkhir}
                onChange={(e) => setSaldoAkhir(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none"
                placeholder="Hitung seluruh uang di kasir..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Menutup..." : "Tutup Shift & Kunci Kasir"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}