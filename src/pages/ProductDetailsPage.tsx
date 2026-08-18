import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../api";
import type { Product } from "../types/ProductTypes";
import Toast from "../components/Toast";

export default function ProductDetailsPage() {
  const { barcode = "" } = useParams<{ barcode: string }>();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const state = location.state as { toast?: { message: string; type: "success" | "error" } } | null;

    if (state?.toast) {
      setToast(state.toast);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      if (!barcode) {
        setErrorMessage("Código de barras não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);
        const { data } = await api.get<Product>(`/products/${encodeURIComponent(barcode)}`);
        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = (err as Error).message;
          setProduct(null);
          setErrorMessage(message);
          setToast({ message, type: "error" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [barcode]);

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Detalhes do Produto</h1>
        </div>
        <Link to="/products" className="btn btn-secondary">
          Voltar para Produtos
        </Link>
      </div>

      {loading ? (
        <div className="card">
          <p className="empty-text">Carregando produto...</p>
        </div>
      ) : errorMessage ? (
        <div className="card">
          <h2>Produto não disponível</h2>
          <p className="empty-text">{errorMessage}</p>
        </div>
      ) : product ? (
        <div className="card detail-card">
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Código de Barras</span>
              <strong data-testid="product-barcode">{product.barcode}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Nome</span>
              <strong data-testid="product-name">{product.name}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quantidade em Estoque</span>
              <strong data-testid="product-quantity">{product.quantityInStock}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <p className="empty-text">Produto não encontrado.</p>
        </div>
      )}
    </div>
  );
}