import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen shadow-md p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">App Kasir</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded">Dashboard</Link>
        <Link to="/kasir" className="p-2 hover:bg-gray-100 rounded">Kasir</Link>
        <Link to="/produk" className="p-2 hover:bg-gray-100 rounded">Produk</Link>
        <Link to="/laporan" className="p-2 hover:bg-gray-100 rounded">Laporan</Link>
      </nav>
    </div>
  );
}

export default Sidebar;