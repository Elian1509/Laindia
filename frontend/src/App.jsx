import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  return role ? (
    <Dashboard role={role} />
  ) : (
    <Login onLogin={(r) => setRole(r)} />
  );
}
