import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../api";
import Toast from "../components/Toast";
import type { ProductOrder } from "../types/ProductOrderTypes";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}

export default function ProductOrderDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<ProductOrder | null>(null);
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

    async function fetchOrder() {
      if (!id) {
        setErrorMessage("ID do pedido não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);
        const { data } = await api.get<ProductOrder>(`/product-orders/${encodeURIComponent(id)}`);
        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = (err as Error).message;
          setOrder(null);
          setErrorMessage(message);
          setToast({ message, type: "error" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Detalhes do Pedido</h1>
        </div>
        <Link to="/orders" className="btn btn-secondary">
          Voltar para Pedidos
        </Link>
      </div>

      {loading ? (
        <div className="card">
          <p className="empty-text">Carregando pedido...</p>
        </div>
      ) : errorMessage ? (
        <div className="card">
          <h2>Pedido não disponível</h2>
          <p className="empty-text">{errorMessage}</p>
        </div>
      ) : order ? (
        <div className="card detail-card" data-testid="product-order-detail">
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">ID</span>
              <strong className="uuid">{order.id}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Produto</span>
              <strong data-testid="product-order-detail-product">{order.product.name}</strong>
              <code>{order.product.barcode}</code>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quantidade</span>
              <strong data-testid="product-order-detail-quantity">{order.orderQuantity}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Data do pedido</span>
              <strong>{formatDate(order.orderDate)}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <strong data-testid="product-order-detail-status">
                <span className="badge badge-blue">{order.status}</span>
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <p className="empty-text">Pedido não encontrado.</p>
        </div>
      )}
    </div>
  );
}
