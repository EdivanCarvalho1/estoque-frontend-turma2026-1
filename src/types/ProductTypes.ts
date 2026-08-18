export interface CreateProductRequest {
  barcode: string;
  name: string;
}

export interface Product {
  barcode: string;
  name: string;
  quantityInStock: number;
}