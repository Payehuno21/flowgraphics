// src/pages/OrderDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams(); // ID obtenido de la URL (debe ser el auto-ID generado por Firestore)
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Función para imprimir
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    // Función para recuperar el pedido de Firestore
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "orders", id);
        const snapshot = await getDoc(orderRef);
        if (snapshot.exists()) {
          // Asigna el auto-ID de Firestore y los datos del documento
          setOrder({ id: snapshot.id, ...snapshot.data() });
        } else {
          setError("Pedido no encontrado.");
        }
      } catch (err) {
        console.error("Error al obtener el pedido:", err);
        setError("Error al cargar el pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <div className="order-detail-container">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container">
        <p>Pedido no encontrado.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-content">
        <div className="order-detail-header">
          <img src="/logo3.png" alt="Logo DG" className="order-logo" />
          <h2>Detalle del Pedido</h2>
        </div>

        <div className="order-info">
          <p><strong>ID:</strong> {order.id}</p>
          <p><strong>Fecha Captura:</strong> {order.captureDate}</p>
          <p><strong>Cliente:</strong> {order.cliente}</p>
          {order.clienteReferencia && <p><strong>Referencia:</strong> {order.clienteReferencia}</p>}
          <p><strong>Medida:</strong> {order.ancho} x {order.alto} cm</p>
          <p><strong>Material:</strong> {order.material} ({order.materialTipo})</p>
          {order.montadoEn && <p><strong>Montado en:</strong> {order.montadoEn}</p>}
          {order.tamano && <p><strong>Tamaño:</strong> {order.tamano}</p>}
          {order.tipoImpresion && <p><strong>Tipo de Impresión:</strong> {order.tipoImpresion}</p>}
          {order.cantidad && <p><strong>Cantidad:</strong> {order.cantidad}</p>}
          <p><strong>Fecha Entrega:</strong> {order.fechaEntrega}</p>
          <p><strong>Terminados:</strong> {order.terminados}</p>
          <p><strong>Status:</strong> {order.status}</p>
          {order.observaciones && <p><strong>Observaciones:</strong> {order.observaciones}</p>}
        </div>

        <div className="order-images">
          {order.referenciaImage && (
            <div className="order-image">
              <h3>Imagen de Referencia</h3>
              <img src={order.referenciaImage} alt="Referencia" />
            </div>
          )}
          {order.disenoImage && (
            <div className="order-image">
              <h3>Imagen de Diseño</h3>
              <img src={order.disenoImage} alt="Diseño" />
            </div>
          )}
        </div>

        <div className="order-detail-actions">
          <button onClick={handlePrint}>Imprimir / Guardar como PDF</button>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
