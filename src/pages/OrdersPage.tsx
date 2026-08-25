import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Toast from "../components/Toast";
import type { ProductOrder } from "../types/ProductOrderTypes";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}

function statusClass(status: string) {
  return status.toLowerCase() === "opened" ? "badge-blue" : "badge-gray";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const { data } = await api.get<ProductOrder[]>("/product-orders");
      setOrders(data);
    } catch (err) {
      const message = (err as Error).message;
      setErrorMessage(message);
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Todos os Pedidos</h1>
          <p className="text-muted">Acompanhe pedidos de produtos e consulte seus detalhes.</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary">
          Novo Pedido
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <p className="empty-text">Carregando pedidos...</p>
        ) : errorMessage ? (
          <div className="empty-text">
            <p>Não foi possível carregar os pedidos.</p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={fetchOrders}>
              Tentar novamente
            </button>
          </div>
        ) : orders.length === 0 ? (
          <p className="empty-text">Nenhum pedido cadastrado.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} data-testid="product-order-row">
                    <td>
                      <strong>{order.product.name}</strong>
                      <br />
                      <code>{order.product.barcode}</code>
                    </td>
                    <td>{order.orderQuantity}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>
                      <span className={`badge ${statusClass(order.status)}`}>{order.status}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/orders/${encodeURIComponent(order.id)}`} className="btn btn-secondary btn-sm">
                          Detalhes
                        </Link>
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
