import { useState } from "react";
import { getDailyReport, exportReportCSV, exportReportPDF } from "../services/api";

export default function Reportes() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    setLoading(true);
    setError("");
    try {
      const data = await getDailyReport(date);
      setReport(data);
    } catch (e) {
      setError("Error al obtener el reporte: " + e.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCSV() {
    try {
      await exportReportCSV(date);
    } catch (e) {
      setError("Error al exportar CSV: " + e.message);
    }
  }

  async function handleExportPDF() {
    try {
      await exportReportPDF(date);
    } catch (e) {
      setError("Error al exportar PDF: " + e.message);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reportes de Ventas</h2>

      {/* Selector de fecha */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Seleccionar Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Reporte */}
      {report && (
        <div>
          {/* Resumen general */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600 text-sm">Total Transacciones</p>
              <p className="text-3xl font-bold text-blue-600">
                {report.totalSales}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600 text-sm">Total Ingresos</p>
              <p className="text-3xl font-bold text-green-600">
                 ${report.totalAmount ? report.totalAmount.toFixed(2) : "0.00"}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600 text-sm">Productos Vendidos</p>
              <p className="text-3xl font-bold text-purple-600">
                {report.items?.length || 0}
              </p>
            </div>
          </div>

          {/* Botones de exportación */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleExportCSV}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <span>📄</span> Exportar CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <span>📕</span> Exportar PDF
            </button>
          </div>

          {/* Tabla de productos vendidos */}
          {report.productsSold && report.productsSold.length > 0 && (
            <div className="bg-white rounded shadow overflow-hidden">
              <h3 className="text-xl font-semibold p-4 bg-gray-100">
                Productos Vendidos
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Producto</th>
                      <th className="p-3 text-left">SKU</th>
                      <th className="p-3 text-right">Cantidad</th>
                      <th className="p-3 text-right">Precio Unitario</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.productsSold.map((product, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-3">{product.productName}</td>
                        <td className="p-3 text-gray-600">{product.sku}</td>
                        <td className="p-3 text-right">{product.totalQuantity}</td>
                        <td className="p-3 text-right">${product.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-semibold">
                          ${(product.totalQuantity * product.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr className="border-t-2">
                      <td colSpan="4" className="p-3 text-right">
                        TOTAL GENERAL:
                      </td>
                      <td className="p-3 text-right text-green-600 text-lg">
                        ${report.totalRevenue.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Tabla de transacciones */}
          {report.transactions && report.transactions.length > 0 && (
            <div className="bg-white rounded shadow overflow-hidden mt-6">
              <h3 className="text-xl font-semibold p-4 bg-gray-100">
                Detalle de Transacciones
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">N° Transacción</th>
                      <th className="p-3 text-left">Usuario</th>
                      <th className="p-3 text-left">Fecha/Hora</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.transactions.map((transaction) => (
                      <tr key={transaction.transactionNumber} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-mono">{transaction.transactionNumber}</td>
                        <td className="p-3">{transaction.username}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleString('es-CO')}
                        </td>
                        <td className="p-3 text-right font-semibold">
                          ${transaction.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sin datos */}
          {(!report.productsSold || report.productsSold.length === 0) && (
            <div className="bg-white p-8 rounded shadow text-center text-gray-400">
              No hay ventas registradas para esta fecha
            </div>
          )}
        </div>
      )}

      {/* Estado inicial */}
      {!report && !loading && !error && (
        <div className="bg-white p-8 rounded shadow text-center text-gray-400">
          Selecciona una fecha y haz clic en "Buscar" para ver el reporte. Para un reporte mas detallado, por favor exportelos.
        </div>
      )}
    </div>
  );
}