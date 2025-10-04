import { useState } from "react";
import { login } from "../services/api";
import { useUser } from "./useUser";

export default function Login({ onLogin }) {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUserData } = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const data = await login(username, password);
      
      // Decodificar el token para obtener el rol y userId
      const token = data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      if (role) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", payload.sub || username);
        
        // IMPORTANTE: Obtener userId
        let userId = payload.userId;
        
        /*
        // Si no está en el token, hacer petición adicional o usar un valor temporal
        if (!userId) {
          // Por ahora, pedir al usuario que ingrese su ID
          // O hacer una petición al backend para obtenerlo
          console.warn("userId no encontrado en token");
          // Opción temporal: usar el username como referencia
          userId = prompt("Por favor ingresa tu ID de usuario (temporal):");
        }*/
        
        if (userId) {
          localStorage.setItem("userId", userId);
          updateUserData(parseInt(userId), payload.sub, role);
        }
        
        onLogin(role);
      } else {
        console.error("No se encontró el rol en el token");
        setError("Error al obtener el rol del usuario");
      }
    } catch (err) {
      console.error("Error durante el login:", err);
      setError("Error de autenticación: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-2xl w-96">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-gray-600 text-sm mt-2">Sistema de Inventario y Ventas</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Usuario
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={e => setUser(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Contraseña
          </label>
          <input
            type="password"
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={e => setPass(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition disabled:bg-gray-400"
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}