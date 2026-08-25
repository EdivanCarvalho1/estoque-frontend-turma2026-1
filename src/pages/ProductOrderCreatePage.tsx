import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import Toast from "../components/Toast";
import type { Product } from "../types/ProductTypes";
import type { CreateProductOrderRequest, ProductOrder } from "../types/ProductOrderTypes";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ProductOrderCreatePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [barcode, setBarcode] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("1");
  const [orderDate, setOrderDate] = useState(getToday);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const { data } = await api.get<Product[]>("/products");
        if (!cancelled) {
          setProducts(data);
          setBarcode(data[0]?.barcode ?? "");
        }
      } catch (err) {
        if (!cancelled) {
          const message = (err as Error).message;
          setErrorMessage(message);
          setToast({ message, type: "error" });
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: CreateProductOrderRequest = {
        barcode,
        orderQuantity: Number(orderQuantity),
        orderDate,
      };
      const { data } = await api.post<ProductOrder>("/product-orders", payload);
      navigate(`/orders/${encodeURIComponent(data.id)}`, {
        state: { toast: { message: "Pedido criado com sucesso!", type: "success" as const } },
      });
    } catch (err) {
      const message = (err as Error).message;
      setErrorMessage(message);
      setToast({ message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Novo Pedido</h1>
          <p className="text-muted">Escolha um produto e informe os dados do pedido.</p>
        </div>
        <Link to="/orders" className="btn btn-secondary">
          Voltar para Pedidos
        </Link>
      </div>

      <div className="card form-card">
        <h2>Dados do Pedido</h2>
        {loadingProducts ? (
          <p className="empty-text">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <div className="empty-text">
            <p>Nenhum produto disponível para pedido.</p>
            <Link to="/products/new" className="btn btn-secondary btn-sm">
              Cadastrar produto
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="form" data-testid="product-order-form">
            <div className="field">
              <label htmlFor="product-order-product">Produto</label>
              <select
                id="product-order-product"
                data-testid="product-order-product"
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
                required
              >
                <option value="" disabled>
                  Selecione um produto
                </option>
                {products.map((product) => (
                  <option key={product.barcode} value={product.barcode}>
                    {product.name} ({product.barcode})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="product-order-quantity">Quantidade</label>
              <input
                id="product-order-quantity"
                data-testid="product-order-quantity"
                type="number"
                min="1"
                step="1"
                value={orderQuantity}
                onChange={(event) => setOrderQuantity(event.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="product-order-date">Data do pedido</label>
              <input
                id="product-order-date"
                data-testid="product-order-date"
                type="date"
                max={getToday()}
                value={orderDate}
                onChange={(event) => setOrderDate(event.target.value)}
                required
              />
            </div>

            {errorMessage && <p className="text-muted">{errorMessage}</p>}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" data-testid="product-order-submit" disabled={submitting}>
                {submitting ? "Criando..." : "Criar Pedido"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
