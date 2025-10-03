const API_URL = "http://localhost:8080/api";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error("Error en login");
  return res.json();
}

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { "Authorization": `Bearer ${token}` };
}
export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function addProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error("Error al agregar producto");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}

