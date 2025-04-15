// src/pages/Notificaciones.js
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Notificaciones.css";

const Notificaciones = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Escucha en tiempo real la colección "orders" ordenada por timestamp descendente.
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Extraemos el id autogenerado de Firestore y los datos del documento
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Pedidos desde Firestore:", ordersData);
      setNotifications(ordersData);
    }, (error) => console.error("Error leyendo órdenes:", error));
    return () => unsubscribe();
  }, []);

  // Calcula cuántos pedidos tienen viewed === false.
  const unseenCount = notifications.filter((notif) => notif.viewed === false).length;

  // Al hacer click en una notificación, se navega a la vista de detalle.
  const handleNotificationClick = (id) => {
    navigate(`/order/${id}`);
  };

  return (
    <div className="notificaciones-container">
      <h2>Notificaciones</h2>
      {/* Badge global: se muestra si hay notificaciones no vistas */}
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
              <p>
                <strong>ID:</strong> {notif.id}
              </p>
              <p>
                <strong>Cliente:</strong> {notif.cliente}
              </p>
              <p>
                <strong>Status:</strong> {notif.status}
              </p>
              {/* Solo muestra "Nuevo" si el pedido no ha sido visto */}
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
