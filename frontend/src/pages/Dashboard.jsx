import { useState } from "react";
import Inventario from "./Inventario";
import Caja from "./Caja";
import Reportes from "./Reportes";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const [tab, setTab] = useState("inventario");

  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-200">
        {role === "ADMIN" && <button onClick={() => setTab("inventario")}>Inventario</button>}
        <button onClick={() => setTab("caja")}>Caja</button>
        {role === "ADMIN" && <button onClick={() => setTab("reportes")}>Reportes</button>}
      </nav>
      <div className="p-4">
        {tab === "inventario" && <Inventario />}
        {tab === "caja" && <Caja />}
        {tab === "reportes" && <Reportes />}
      </div>
    </div>
  );
}
