import { useEffect, useState } from "react";
import { getProducts, addProduct, deleteProduct } from "../services/api";

export default function Inventario() {
  const role = localStorage.getItem("role");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ sku: "", name: "", price: 0, stock: 0 });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    await addProduct(form);
    setForm({ sku: "", name: "", price: 0, stock: 0 });
    loadProducts();
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    loadProducts();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Inventario</h2>

      {/* Tabla de productos */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">SKU</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            {role === "ADMIN" && <th className="p-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.sku}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.stock}</td>
              {role === "ADMIN" && (
                <td className="p-2">
                  <button 
                    onClick={() => handleDelete(p.id)} 
                    className="bg-red-500 text-white px-2 py-1 rounded">
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario agregar (solo Admin) */}
      {role === "ADMIN" && (
        <form onSubmit={handleAdd} className="mt-4 flex gap-2">
          <input
            placeholder="SKU"
            value={form.sku}
            onChange={e => setForm({ ...form, sku: e.target.value })}
            className="border p-1"
          />
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border p-1"
          />
          <input
            type="number"
            placeholder="Precio"
            value={form.price}
            onChange={e => setForm({ ...form, price: +e.target.value })}
            className="border p-1"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: +e.target.value })}
            className="border p-1"
          />
          <button className="bg-green-500 text-white px-4 py-1 rounded">Agregar</button>
        </form>
      )}
    </div>
  );
}
