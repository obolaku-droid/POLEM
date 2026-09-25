import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      // Jika berhasil login, langsung arahkan ke Dashboard
      navigate("/");
    } catch (error) {
      alert("Gagal login: Pastikan email dan password benar!");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight mb-2">
            App <span className="text-orange-500">Kasir</span>
          </h1>
          <p className="text-gray-500 text-sm">Silakan login untuk mengakses sistem</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="admin@email.com"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg transition-all ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            {isLoading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}