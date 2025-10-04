import { useState } from "react";
import { logout } from "../services/api";
import Inventario from "./Inventario";
import Caja from "./Caja";
import Reportes from "./Reportes";
import Usuarios from "./Usuarios";

export default function Dashboard({ role }) {
  const [activeModule, setActiveModule] = useState(
    role === "ADMIN" ? "inventario" : "caja"
  );

  async function handleLogout() {
    try {
      await logout();
    } catch (e) {
      console.error("Error en logout:", e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  }

  // Obtener username del token
  const getUsername = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "Usuario";
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || "Usuario";
    } catch {
      return "Usuario";
    }
  };

  const username = getUsername();
  const isAdmin = role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sistema de Inventario y Ventas
            </h1>
            <p className="text-sm text-gray-600">
              {username} - {isAdmin ? "Administrador" : "Cajero"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded shadow p-4 space-y-2">
              {isAdmin && (
                <>
                  <button
                    onClick={() => setActiveModule("inventario")}
                    className={`w-full text-left px-4 py-3 rounded transition ${
                      activeModule === "inventario"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    📦 Inventario
                  </button>

                  <button
                    onClick={() => setActiveModule("usuarios")}
                    className={`w-full text-left px-4 py-3 rounded transition ${
                      activeModule === "usuarios"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    👥 Usuarios
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveModule("caja")}
                className={`w-full text-left px-4 py-3 rounded transition ${
                  activeModule === "caja"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                💰 Caja
              </button>

              <button
                onClick={() => setActiveModule("reportes")}
                className={`w-full text-left px-4 py-3 rounded transition ${
                  activeModule === "reportes"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                📊 Reportes
              </button>

              {!isAdmin && (
                <button
                  onClick={() => setActiveModule("inventario")}
                  className={`w-full text-left px-4 py-3 rounded transition ${
                    activeModule === "inventario"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  📦 Ver Inventario
                </button>
              )}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded shadow">
              {activeModule === "inventario" && <Inventario />}
              {activeModule === "caja" && <Caja />}
              {activeModule === "reportes" && <Reportes />}
              {activeModule === "usuarios" && isAdmin && <Usuarios />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
        </div>
      </footer>
    </div>
  );
}