import type { Product } from "./ProductTypes";

export interface ProductOrder {
  id: string;
  product: Product;
  orderQuantity: number;
  orderDate: string;
  status: string;
}

export interface CreateProductOrderRequest {
  barcode: string;
  orderQuantity: number;
  orderDate: string;
}
