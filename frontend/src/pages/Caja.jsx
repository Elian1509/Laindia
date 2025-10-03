import { useEffect, useState } from "react";
import { getProducts, registerSale } from "../services/api";

export default function Caja() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      setError("Error al cargar productos");
      console.error(e);
    }
  }

  function addToCart(product) {
    const existing = cart.find(item => item.productId === product.id);
    
    if (existing) {
      // Verificar stock disponible
      if (existing.quantity >= product.stock) {
        setError(`No hay suficiente stock de ${product.name}`);
        setTimeout(() => setError(""), 3000);
        return;
      }
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.stock === 0) {
        setError(`${product.name} no tiene stock disponible`);
        setTimeout(() => setError(""), 3000);
        return;
      }
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        maxStock: product.stock
      }]);
    }
  }

  function updateQuantity(productId, newQuantity) {
    const item = cart.find(i => i.productId === productId);
    
    if (newQuantity > item.maxStock) {
      setError(`Stock máximo: ${item.maxStock}`);
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  }

  function removeFromCart(productId) {
    setCart(cart.filter(item => item.productId !== productId));
  }

  function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      setError("El carrito está vacío");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      // Obtener userId del token
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Nota: El backend espera userId, pero el token tiene username
      // Necesitarías ajustar esto según tu backend
      const saleData = {
        userId: 1, // Por ahora hardcodeado, idealmente obtenerlo del contexto
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const result = await registerSale(saleData);
      
      setSuccess(`Venta registrada exitosamente. Transacción #${result.transactionNumber}`);
      setCart([]);
      loadProducts(); // Recargar productos para actualizar stock
      
      setTimeout(() => setSuccess(""), 5000);
    } catch (e) {
      setError("Error al registrar la venta: " + e.message);
      setTimeout(() => setError(""), 5000);
      console.error(e);
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Módulo de Caja</h2>

      {/* Mensajes */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de productos */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Productos Disponibles</h3>
          
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
          />

          <div className="border rounded max-h-96 overflow-y-auto">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="p-3 border-b hover:bg-gray-50 flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  <p className="text-sm">
                    <span className="font-semibold">${product.price}</span>
                    <span className="text-gray-500 ml-2">Stock: {product.stock}</span>
                  </p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`px-4 py-2 rounded ${
                    product.stock === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Carrito de Compras</h3>
          
          {cart.length === 0 ? (
            <div className="border rounded p-8 text-center text-gray-400">
              El carrito está vacío
            </div>
          ) : (
            <>
              <div className="border rounded mb-4 max-h-80 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.productId} className="p-3 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ${item.price} x {item.quantity} = ${item.price * item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                        className="border p-1 w-16 text-center rounded"
                        min="1"
                        max={item.maxStock}
                      />
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-500 ml-2">
                        Max: {item.maxStock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total y checkout */}
              <div className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded"
                >
                  Finalizar Compra
                </button>
                
                <button
                  onClick={() => setCart([])}
                  className="w-full mt-2 bg-gray-300 hover:bg-gray-400 py-2 rounded"
                >
                  Vaciar Carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}