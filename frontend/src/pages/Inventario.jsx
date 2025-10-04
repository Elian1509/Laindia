import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../services/api";

export default function Inventario() {
  const role = localStorage.getItem("role");
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ sku: "", name: "", description: "", price: 0, stock: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error("Error al cargar productos", e);
      setError("Error al cargar productos");
      setProducts([]);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      if (editingId) {
        await updateProduct({...form, id: editingId});
        setSuccess("Producto actualizado correctamente");
        setEditingId(null);
      } else {
        await addProduct(form);
        setSuccess("Producto agregado correctamente");
      }
      setForm({ sku: "", name: "", description: "", price: 0, stock: 0 });
      loadProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch(err) {
      setError("Error: " + err.message);
      setTimeout(() => setError(""), 5000);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      await deleteProduct(id);
      setSuccess("Producto eliminado correctamente");
      loadProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al eliminar: " + err.message);
      setTimeout(() => setError(""), 5000);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
  }

  function handleCancel() {
    setEditingId(null);
    setForm({ sku: "", name: "", description: "", price: 0, stock: 0 });
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {role === "ADMIN" ? "Gestión de Inventario" : "Inventario de Productos"}
      </h2>

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

      {/* Tabla de productos */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">SKU</th>
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Descripción</th>
              <th className="p-3 border">Precio</th>
              <th className="p-3 border">Stock</th>
              {role === "ADMIN" && <th className="p-3 border">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={role === "ADMIN" ? 6 : 5} className="p-8 text-center text-gray-400">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 border font-mono">{p.sku}</td>
                  <td className="p-3 border font-semibold">{p.name}</td>
                  <td className="p-3 border text-gray-600">{p.description}</td>
                  <td className="p-3 border text-right">${p.price.toFixed(2)}</td>
                  <td className="p-3 border text-right">
                    <span className={`px-2 py-1 rounded ${
                      p.stock === 0 ? "bg-red-100 text-red-800" :
                      p.stock < 10 ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  {role === "ADMIN" && (
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario agregar/editar (solo Admin) */}
      {role === "ADMIN" && (
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="text-lg font-semibold mb-3">
            {editingId ? "Editar Producto" : "Agregar Nuevo Producto"}
          </h3>
          
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              required
              placeholder="SKU"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              required
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Descripción"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              required
              type="number"
              step="0.01"
              placeholder="Precio"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: +e.target.value })}
              className="border p-2 rounded"
            />
            <input
              required
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: +e.target.value })}
              className="border p-2 rounded"
            />
            
            <div className="md:col-span-5 flex gap-2">
              <button 
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
              >
                {editingId ? "Actualizar Producto" : "Agregar Producto"}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}