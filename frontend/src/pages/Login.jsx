import { useState } from "react";
import { login } from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");

async function handleSubmit(e) {
  e.preventDefault();
  try {
    const data = await login(username, password);
    
    // Decodificar el token para obtener el rol
    const token = data.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;

    

    if (role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      onLogin(role);
    } else {
      console.error("No se encontró el rol en el token");
      setError("Error al obtener el rol del usuario");
    }
  } catch (err) {
    console.error("Error durante el login:", err);
    setError("Error de autenticación: " + err.message);
  }
}

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Usuario"
          value={username}
          onChange={e => setUser(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 mb-2 w-full"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPass(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
