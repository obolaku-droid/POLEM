import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Shift() {
  const [activeShift, setActiveShift] = useState(null);
  const [saldoAwal, setSaldoAwal] = useState("");
  const [saldoAkhir, setSaldoAkhir] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Cek apakah ada shift yang sedang buka saat halaman dimuat
  useEffect(() => {
    fetchActiveShift();
  }, []);

  const fetchActiveShift = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("status", "buka")
        .single(); // Cari 1 shift yang statusnya 'buka'
      
      if (data) setActiveShift(data);
    } catch (error) {
      console.log("Tidak ada shift aktif");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBukaShift = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.from("shifts").insert([{
        waktu_buka: new Date().toLocaleString("id-ID"),
        saldo_awal: parseInt(saldoAwal),
        status: "buka"
      }]);
      
      if (error) throw error;
      alert("Shift berhasil dibuka!");
      fetchActiveShift();
      setSaldoAwal("");
    } catch (error) {
      alert("Gagal membuka shift: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutupShift = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("shifts")
        .update({
          waktu_tutup: new Date().toLocaleString("id-ID"),
          saldo_akhir: parseInt(saldoAkhir),
          status: "tutup"
        })
        .eq("id", activeShift.id);
      
      if (error) throw error;
      alert("Shift berhasil ditutup!");
      setActiveShift(null);
      setSaldoAkhir("");
    } catch (error) {
      alert("Gagal menutup shift: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-6">Memuat data shift...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Manajemen Shift Kasir</h2>

      {!activeShift ? (
        // TAMPILAN JIKA SHIFT BELUM DIBUKA
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <span className="text-4xl">🔒</span>
            <h3 className="text-xl font-bold text-orange-700 mt-2">Kasir Sedang Tutup</h3>
            <p className="text-orange-600 text-sm mt-1">Buka shift terlebih dahulu untuk mulai melayani pelanggan.</p>
          </div>
          
          <form onSubmit={handleBukaShift} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Uang Modal Awal (Cash di Laci)</label>
              <input 
                type="number" 
                value={saldoAwal}
                onChange={(e) => setSaldoAwal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="Contoh: 150000"
                required
              />
            </div>
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
              Buka Shift Sekarang
            </button>
          </form>
        </div>
      ) : (
        // TAMPILAN JIKA SHIFT SEDANG AKTIF (BUKA)
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <span className="text-4xl">🔓</span>
            <h3 className="text-xl font-bold text-green-700 mt-2">Shift Sedang Aktif</h3>
            <p className="text-green-600 text-sm mt-1">Dibuka pada: {activeShift.waktu_buka}</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6 text-center border border-green-100">
            <p className="text-sm text-gray-500 font-semibold">Modal Awal</p>
            <p className="text-2xl font-extrabold text-gray-800">Rp {activeShift.saldo_awal.toLocaleString("id-ID")}</p>
          </div>
          
          <form onSubmit={handleTutupShift} className="space-y-4 border-t border-green-200 pt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Uang Fisik di Laci Saat Ini</label>
              <input 
                type="number" 
                value={saldoAkhir}
                onChange={(e) => setSaldoAkhir(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Hitung seluruh uang tunai di laci..."
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors">
              Akhiri & Tutup Shift
            </button>
          </form>
        </div>
      )}
    </div>
  );
}