// src/pages/Notificaciones.js
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Notificaciones.css";

const Notificaciones = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id, // Usamos el auto-ID de Firestore
        ...doc.data()
      }));
      console.log("Notificaciones recibidas:", ordersData); // Depuración
      setNotifications(ordersData);
    }, (error) => {
      console.error("Error leyendo órdenes:", error);
    });
    return () => unsubscribe();
  }, []);

  // Calcula cuántos pedidos tienen `viewed === false`
  const unseenCount = notifications.filter((notif) => notif.viewed === false).length;

  const handleNotificationClick = (id) => {
    // Al hacer clic, navega a los detalles de la orden.
    navigate(`/order/${id}`);
  };

  return (
    <div className="notificaciones-container">
      <h2>Notificaciones</h2>
      {/* Badge global que muestra el contador de órdenes no vistas */}
      {unseenCount > 0 && (
        <div className="global-badge">
          Tienes {unseenCount} pedido{unseenCount > 1 ? "s" : ""} nuevo{unseenCount > 1 ? "s" : ""}
        </div>
      )}
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No hay notificaciones registradas.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${notif.viewed === false ? "unseen" : "seen"}`}
              onClick={() => handleNotificationClick(notif.id)}
            >
              <p><strong>ID:</strong> {notif.id}</p>
              <p><strong>Cliente:</strong> {notif.cliente}</p>
              <p><strong>Status:</strong> {notif.status}</p>
              {/* Se muestra la etiqueta "Nuevo" si el pedido no está visto */}
              {notif.viewed === false && (
                <span className="notification-indicator">Nuevo</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notificaciones;
