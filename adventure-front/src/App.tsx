import { useEffect, useState } from 'react';
import { getTopProducts, getProductOrders, updateTrackingNumber, type ProductTop, type ProductOrder } from './services/api';

function App() {
  const [products, setProducts] = useState<ProductTop[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductTop | null>(null);
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  
  const [selectedOrder, setSelectedOrder] = useState<ProductOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTopProducts().then(setProducts).catch(console.error);
  }, []);

  // Paso 1 -> 2
  const handleSelectProduct = async (product: ProductTop) => {
    setSelectedProduct(product);
    setSelectedOrder(null);
    setLoading(true);
    try {
      const data = await getProductOrders(product.productoId);
      setOrders(data);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2 -> 3
  const handleSelectOrder = (order: ProductOrder) => {
    setSelectedOrder(order);
    setTrackingNumber('');
  };

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    if (trackingNumber.trim() === '') {
      alert('Por favor ingresa un número de rastreo válido.');
      return;
    }

    try {
      await updateTrackingNumber(selectedOrder.salesOrderId, selectedOrder.salesOrderDetailId, trackingNumber);
      alert('¡Número de rastreo guardado con éxito!');
      setSelectedOrder(null);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al guardar el rastreo.');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Panorama General de Ventas</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', alignItems: 'flex-start' }}>
        
        <div style={{ flex: 1, backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3>1. Top 5 Productos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
            {products.map((p) => (
              <div 
                key={p.productoId} 
                onClick={() => handleSelectProduct(p)}
                style={{ 
                  backgroundColor: 'white', padding: '15px', borderRadius: '8px', 
                  border: selectedProduct?.productoId === p.productoId ? '2px solid #3b82f6' : '1px solid #ddd',
                  cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ height: '80px', backgroundColor: '#e5e7eb', marginBottom: '10px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  [Imagen]
                </div>
                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>{p.nombre}</strong>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Cant: {p.cantidadTotalVendida}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total: ${p.montoTotalVendido.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedProduct && (
          <div style={{ flex: 1, backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3>2. Órdenes - {selectedProduct.nombre}</h3>
            {loading ? <p>Cargando...</p> : (
              <table style={{ width: '100%', backgroundColor: 'white', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #ddd' }}>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>ID Detalle</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Cant.</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.salesOrderDetailId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{o.salesOrderId}</td>
                      <td style={{ padding: '10px' }}>{o.salesOrderDetailId}</td>
                      <td style={{ padding: '10px' }}>{new Date(o.fechaOrden).toLocaleDateString()}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{o.cantidad}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleSelectOrder(o)}
                          style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {selectedOrder && (
          <div style={{ flex: '0.8', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>3. Detalle de la orden</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '20px' }}>
              <div><strong>SalesOrderID:</strong> {selectedOrder.salesOrderId}</div>
              <div><strong>Fecha:</strong> {new Date(selectedOrder.fechaOrden).toLocaleDateString()}</div>
              <div><strong>Producto:</strong> {selectedProduct?.nombre}</div>
              <div><strong>Cantidad:</strong> {selectedOrder.cantidad}</div>
              <div><strong>Precio unitario:</strong> ${selectedOrder.precioUnitario.toFixed(2)}</div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                CarrierTrackingNumber:
              </label>
              <input 
                type="text" 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px' }}
                placeholder="Ej. FEDEX-001"
              />
              <button 
                onClick={handleSaveTracking}
                style={{ width: '100%', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Guardar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;