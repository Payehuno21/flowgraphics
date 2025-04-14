// src/pages/Welcome.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css"; // Asegúrate de tener este archivo de estilos

const Welcome = () => {
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Recupera los datos del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const usuarioObj = JSON.parse(storedUser);
      
      setUserRole(usuarioObj.rol);
    }
    // Establece el timer para redirigir después de 5 segundos
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-container">
      {/* Muestra el logo; coloca tu logo en la carpeta public y asegúrate que la ruta es la correcta */}
      <img
        src="/logo.png"
        alt="Logo Digital Graphics Flow"
        className="welcome-logo"
      />
      <h1 className="welcome-text">
        BIENVENIDO {userRole.toUpperCase()}
      </h1>
    </div>
  );
};

export default Welcome;
