const API_URL = "http://localhost:8080/api";

// Auth

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Error en login");
  const data = await res.json();

  localStorage.setItem("token", data.token);

  const payload = JSON.parse(atob(data.token.split(".")[1]));
  localStorage.setItem("role", payload.role);

  return data;
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
  });
  localStorage.removeItem("token");
  localStorage.setItem("role");
  if (!res.ok) throw new Error("Error al cerrar sesion");
}
export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// Productos
export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Error al obtener producto");
  return res.json();
}

export async function addProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Error al agregar producto");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}

export async function updateProduct(product) {
  const res = await fetch(`${API_URL}/products/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error al actualizar producto: ${error}`);
  }
  return res.json();
}

// ventas

export async function registerSale(saleData) {
  const res = await fetch(`${API_URL}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(saleData),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error al registrar venta: ${error}`);
  }
  return res.json();
}

