// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";  // Asegúrate de tener un Login
import NewOrder from "./pages/NewOrder";
import Dashboard from "./pages/Dashboard";
import Notificaciones from "./pages/Notificaciones";
import Welcome from "./pages/Welcome";
import OrderDetail from "./pages/OrderDetail";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome userName="Usuario" />} />
        <Route path="/" element={<MainLayout><NewOrder /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/notificaciones" element={<MainLayout><Notificaciones /></MainLayout>} />
        <Route path="/order/:id" element={<OrderDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
