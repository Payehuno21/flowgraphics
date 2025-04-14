// src/pages/OrderForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
  const [cliente, setCliente] = useState('');
  const [ancho, setAncho] = useState('');
  const [alto, setAlto] = useState('');
  const [material, setMaterial] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [referencia, setReferencia] = useState('');
  const [diseno, setDiseno] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí agregarías validación y luego enviarías el pedido a la base de datos.
    console.log({ cliente, ancho, alto, material, fechaEntrega, referencia, diseno });
    alert("Pedido realizado exitosamente!");
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Crear Pedido</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cliente (autocompletar):</label>
          <input 
            type="text" 
            value={cliente} 
            onChange={(e) => setCliente(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Medida (cm):</label>
          <input 
            type="number" 
            placeholder="Ancho" 
            value={ancho} 
            onChange={(e) => setAncho(e.target.value)} 
            required 
            style={{ width: '48%', padding: '8px', marginRight: '4%' }}
          />
          <input 
            type="number" 
            placeholder="Alto" 
            value={alto} 
            onChange={(e) => setAlto(e.target.value)} 
            required 
            style={{ width: '48%', padding: '8px' }}
          />
        </div>
        <div>
          <label>Material:</label>
          <select 
            value={material} 
            onChange={(e) => setMaterial(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          >
            <option value="">Seleccione</option>
            <option value="material1">Material 1</option>
            <option value="material2">Material 2</option>
          </select>
        </div>
        <div>
          <label>Fecha de Entrega:</label>
          <input 
            type="date" 
            value={fechaEntrega} 
            onChange={(e) => setFechaEntrega(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Referencia (URL o carga de imagen):</label>
          <input 
            type="text" 
            value={referencia} 
            onChange={(e) => setReferencia(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Diseño (URL o carga de imagen):</label>
          <input 
            type="text" 
            value={diseno} 
            onChange={(e) => setDiseno(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Realizar Pedido</button>
      </form>
    </div>
  );
};

export default OrderForm;
