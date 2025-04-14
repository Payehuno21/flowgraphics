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
    // Crear una query para ordenar los pedidos por timestamp (más nuevos primero)
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    
    // Suscribirse a los cambios en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(ordersData);
    });

    return () => unsubscribe();
  }, []);

  // Al hacer clic en una notificación, navega a los detalles.
  const handleNotificationClick = (id) => {
    navigate(`/order/${id}`);
  };

  return (
    <div className="notificaciones-container">
      <h2>Notificaciones</h2>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No hay notificaciones registradas.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.viewed ? "unseen" : "seen"}`}
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
              {!notif.viewed && (
                <span className="notification-indicator">
                  Nuevo
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notificaciones;