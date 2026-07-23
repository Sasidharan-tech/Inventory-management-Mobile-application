import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ImportExcel from './pages/ImportExcel';
import ExportExcel from './pages/ExportExcel';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 dark:text-slate-100 sm:py-6 sm:px-4">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 shadow-2xl dark:bg-slate-950 sm:min-h-[850px] sm:rounded-[2.5rem] sm:border sm:border-slate-800 sm:overflow-hidden">
        <Navbar />
        <main className="flex-1 px-3.5 pb-20 pt-3.5 sm:px-5 sm:pt-4">
          <Routes>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/import" element={<ImportExcel />} />
            <Route path="/export" element={<ExportExcel />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Sidebar />
      </div>
    </div>
  );
}
