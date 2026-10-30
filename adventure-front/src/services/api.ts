const API_BASE = 'http://localhost:5026/api';

export interface ProductTop {
  productoId: number;
  nombre: string;
  cantidadTotalVendida: number;
  montoTotalVendido: number;
}

export interface ProductOrder {
  salesOrderId: number;
  salesOrderDetailId: number;
  fechaOrden: string;
  cantidad: number;
  precioUnitario: number;
}

export const getTopProducts = async (): Promise<ProductTop[]> => {
  const res = await fetch(`${API_BASE}/products/top`);
  if (!res.ok) throw new Error('Error al obtener los productos top');
  return res.json();
};

export const getProductOrders = async (productId: number): Promise<ProductOrder[]> => {
  const res = await fetch(`${API_BASE}/products/${productId}/orders`);
  if (!res.ok) throw new Error('Error al obtener las órdenes del producto');
  return res.json();
};

export const updateTrackingNumber = async (orderId: number, detailId: number, tracking: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/orders/${orderId}/details/${detailId}/tracking`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ carrierTrackingNumber: tracking })
  });
  if (!res.ok) throw new Error('Error al actualizar el número de rastreo');
};
