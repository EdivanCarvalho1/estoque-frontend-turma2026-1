import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Product } from "../types/ProductTypes";
import Toast from "../components/Toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Product[]>("/products");
      setProducts(data);
    } catch (err) {
      setToast({ message: (err as Error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Todos os Produtos</h1>
          <p className="text-muted">Acompanhe os produtos cadastrados e abra os detalhes individuais.</p>
        </div>
        <Link to="/products/new" className="btn btn-primary">
          Novo Produto
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <p className="empty-text">Carregando...</p>
        ) : products.length === 0 ? (
          <p className="empty-text">Nenhum produto cadastrado.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Código de Barras</th>
                  <th>Nome</th>
                  <th>Estoque</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.barcode}>
                    <td><strong>{p.barcode}</strong></td>
                    <td><strong>{p.name}</strong></td>
                    <td><strong>
                      <span className={`badge ${p.quantityInStock > 0 ? "badge-green" : "badge-red"}`}>
                        {p.quantityInStock}
                      </span>
                    </strong></td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/products/${encodeURIComponent(p.barcode)}`} className="btn btn-secondary btn-sm">
                          Detalhes
                        </Link>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => {}}>
                          Apagar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
