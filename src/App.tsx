import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import OrdersPage from "./pages/OrdersPage";
import ProductOrderCreatePage from "./pages/ProductOrderCreatePage";
import ProductOrderDetailsPage from "./pages/ProductOrderDetailsPage";
import InputsPage from "./pages/InputsPage";
import OutputsPage from "./pages/OutputsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductCreatePage />} />
            <Route path="/products/:barcode" element={<ProductDetailsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/new" element={<ProductOrderCreatePage />} />
            <Route path="/orders/:id" element={<ProductOrderDetailsPage />} />
            <Route path="/inputs" element={<InputsPage />} />
            <Route path="/outputs" element={<OutputsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

