import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiSearch } from "react-icons/fi";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./Dashboard.css";

// Definición de colores para cada status
const statusColors = {
  "Pendiente": "#ff4d4d",      // rojo
  "Diseño": "#007bff",         // azul
  "Impreso": "#ff8800",        // naranja
  "Terminados": "#8e44ad",     // púrpura
  "Realizado": "#28a745",      // verde
  "Entregado": "#218838",      // verde oscuro
  "Cancelado": "#6c757d"       // gris
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  
  // Referencia de audio para notificación (opcional)
  const audioRef = useRef(null);

  // Leer órdenes en tiempo real de Firestore
  useEffect(() => {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((docItem) => ({
        id: docItem.id, // Usamos el auto-ID de Firestore
        ...docItem.data()
      }));
      setOrders(ordersData);
    }, (error) => console.error("Error leyendo órdenes:", error));

    return () => unsubscribe();
  }, []);

  // Inicializar audio (asegúrate de tener "statusChange.mp3" en la carpeta public)
  useEffect(() => {
    audioRef.current = new Audio("/statusChange.mp3");
  }, []);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      (order.cliente && order.cliente.toLowerCase().includes(term)) ||
      (order.id && order.id.toString().includes(term))
    );
  });

  // Actualiza el status de la orden en Firestore
  const handleSaveStatus = async (orderId, e) => {
    e.stopPropagation();
    const orderRef = doc(db, "orders", orderId);
    try {
      // Encuentra la orden actual para comparar el status
      const currentOrder = orders.find((order) => order.id === orderId);
      if (currentOrder && currentOrder.status !== newStatus && audioRef.current) {
        await audioRef.current.play().catch((error) =>
          console.error("Error al reproducir sonido:", error)
        );
      }
      // Actualiza el documento en Firestore
      await updateDoc(orderRef, {
        status: newStatus,
        hasNotification: true
      });
      setEditingOrderId(null);
    } catch (error) {
      console.error("Error al actualizar el status:", error);
    }
  };

  // Navega a la página de detalle de la orden usando el ID de Firestore
  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="new-order-btn" 
          onClick={() => navigate("/")}
          title="Registrar nuevo pedido"
        >
          <FiHome className="sidebar-icon" />
          <span>Nuevo Pedido</span>
        </button>
      </header>

      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por Cliente o ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p>No se encontraron pedidos.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Material</th>
              <th>Fecha Entrega</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              // Toda la fila es clicable para ver detalles, excepto en los botones
              <tr
                key={order.id}
                className="clickable-row"
                onClick={() => handleRowClick(order.id)}
              >
                <td>{order.id}</td>
                <td>{order.cliente}</td>
                <td>{order.material} ({order.materialTipo})</td>
                <td>{order.fechaEntrega}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: statusColors[order.status] || "#fff" }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {editingOrderId === order.id ? (
                    <>
                      <select 
                        value={newStatus} 
                        onChange={(e) => setNewStatus(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Seleccione status</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Diseño">Diseño</option>
                        <option value="Impreso">Impreso</option>
                        <option value="Terminados">Terminados</option>
                        <option value="Realizado">Realizado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                      <button onClick={(e) => handleSaveStatus(order.id, e)}>Guardar</button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingOrderId(null); }}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingOrderId(order.id);
                        setNewStatus(order.status);
                      }}
                    >
                      Cambiar Status
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
