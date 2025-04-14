// src/components/Sidebar.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiEdit, FiBell, FiLogOut } from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  // Función para actualizar el número de notificaciones
  const updateNotificationCount = () => {
    // Suponemos que consideramos "nuevo" los pedidos con status "Pendiente" y viewed === false
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const count = orders.filter(
      (order) => order.status === "Pendiente" && order.viewed === false
    ).length;
    setNotificationCount(count);
  };

  // Ejecutar al cargar el componente, y cada vez que se actualice el localStorage (podrías usar un intervalo o eventos)
  useEffect(() => {
    updateNotificationCount();
    // Opcionalmente, puedes actualizar cada cierto intervalo:
    const interval = setInterval(() => {
      updateNotificationCount();
    }, 3000); // cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo2.png" alt="Logo" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">
              <FiHome className="sidebar-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">
              <FiEdit className="sidebar-icon" />
              <span>Nuevo Pedido</span>
            </Link>
          </li>
          <li className={location.pathname === "/notificaciones" ? "active" : ""}>
            <Link to="/notificaciones">
              <FiBell className="sidebar-icon" />
              <span>Notificaciones</span>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="sidebar-icon" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
