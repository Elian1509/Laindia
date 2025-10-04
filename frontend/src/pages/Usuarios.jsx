import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "CASHIER"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      setError("Error al cargar usuarios: " + e.message);
      console.error(e);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateUser(editingId, form);
        setSuccess("Usuario actualizado correctamente");
      } else {
        await createUser(form);
        setSuccess("Usuario creado correctamente");
      }
      
      setForm({ username: "", password: "", role: "CASHIER" });
      setEditingId(null);
      loadUsers();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    try {
      await deleteUser(id);
      setSuccess("Usuario eliminado correctamente");
      loadUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al eliminar usuario: " + err.message);
      setTimeout(() => setError(""), 5000);
    }
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({
      username: user.username,
      password: "", // No mostrar password
      role: user.role || "CASHIER"
    });
  }

  function handleCancel() {
    setEditingId(null);
    setForm({ username: "", password: "", role: "CASHIER" });
    setError("");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

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

      {/* Formulario */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Usuario *</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Nombre de usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña {editingId ? "(dejar vacío para no cambiar)" : "*"}
            </label>
            <input
              type="password"
              required={!editingId}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Contraseña"
            />
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Rol *</label>
            <select
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="CASHIER">Cajero</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              {editingId ? "Actualizar" : "Crear Usuario"}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">
          Lista de Usuarios
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Rol</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3 font-semibold">{user.username}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.role === "ADMIN" 
                          ? "bg-purple-100 text-purple-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {user.role === "ADMIN" ? "Administrador" : "Cajero"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}