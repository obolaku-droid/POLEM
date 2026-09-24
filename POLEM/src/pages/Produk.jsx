import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Produk() {
  const { products, setProducts } = useContext(AppContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Minuman",
    price: "",
    image: ""
  });

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fungsi baru untuk menangani unggahan file foto
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      // Mengubah file gambar menjadi URL lokal (Base64) agar bisa langsung ditampilkan
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (!formData.name || !formData.price) {
      alert("Nama dan Harga produk wajib diisi!");
      return;
    }

    const newProduct = {
      id: Date.now(), 
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price),
      image: formData.image || "https://images.unsplash.com/photo-1513530176992-0cf73f0c1f28?w=300&h=300&fit=crop" 
    };

    setProducts([...products, newProduct]);
    
    setIsModalOpen(false);
    setFormData({ name: "", category: "Minuman", price: "", image: "" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Produk</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola daftar menu dan harga di sini</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
        >
          + Tambah Produk
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-gray-600 uppercase text-xs leading-normal border-y border-gray-200">
              <th className="py-3 px-6 text-left font-bold">ID</th>
              <th className="py-3 px-6 text-left font-bold">Nama Produk</th>
              <th className="py-3 px-6 text-left font-bold">Kategori</th>
              <th className="py-3 px-6 text-left font-bold">Harga</th>
              <th className="py-3 px-6 text-center font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-gray-400">Belum ada produk.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium text-gray-900">{product.id}</td>
                  <td className="py-3 px-6 font-semibold text-gray-800 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                    {product.name}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`py-1 px-3 rounded-full text-xs font-semibold ${product.category === 'Minuman' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-bold text-gray-700">Rp {product.price.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-6 text-center">
                    <button className="text-blue-500 font-semibold mr-3 hover:text-blue-700">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 font-semibold hover:text-red-700">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM TAMBAH PRODUK */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tambah Produk Baru</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Contoh: Kopi Susu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Minuman">Minuman</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Contoh: 15000"
                  required
                />
              </div>

              {/* UBAHAN: Tombol Upload File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Produk</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                
                {/* Menampilkan Preview Foto setelah file dipilih */}
                {formData.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200" 
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ name: "", category: "Minuman", price: "", image: "" });
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}