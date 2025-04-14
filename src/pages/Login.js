// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importa los iconos outline desde React Icons (Feather Icons)
import { FiUser, FiLock } from "react-icons/fi";
import "./Login.css"; // Asegúrate de que este archivo esté en la misma carpeta

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Aquí puedes definir tus usuarios (o la validación que necesites)
  const usuarios = [
    { usuario: "Administracion", password: "Admin0225", rol: "Administracion" },
    { usuario: "Recepcion", password: "Recep0124", rol: "Recepcion" },
    { usuario: "Ventas", password: "Ventas0321", rol: "Ventas" },
    { usuario: "Impresion", password: "Imprimo0025", rol: "Impresion" },
    { usuario: "Diseño", password: "Design2025", rol: "Diseño" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarioEncontrado = usuarios.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (usuarioEncontrado) {
      setError("");
      localStorage.setItem("user", JSON.stringify(usuarioEncontrado));
      navigate("/welcome");
    } else {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <img
        src="/logo.png"
        alt="Logo Digital Graphics Flow"
        className="login-logo"
      />
      <div className="login-box">
        <h2>INICIAR SESIÓN</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container">
            {/* Usamos el icono outline de usuario */}
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            {/* Usamos el icono outline de candado */}
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
