// src/pages/NewOrder.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiInfo, FiCrop, FiCalendar, FiLayers, FiCheckCircle, FiImage, FiMonitor 
} from 'react-icons/fi';
import './NewOrder.css';

// Importa funciones de Firestore y el objeto db de tu configuración de Firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';

const NewOrder = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  // Estados para campos generales
  const [cliente, setCliente] = useState('');
  const [clienteReferencia, setClienteReferencia] = useState('');
  const [ancho, setAncho] = useState('');
  const [alto, setAlto] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [terminados, setTerminados] = useState('');

  // Estados para selección de material
  const [printedMaterial, setPrintedMaterial] = useState('');
  const [papeleria, setPapeleria] = useState('');

  // Estados para campos extra para Papelería
  const [tamano, setTamano] = useState('');
  const [tipoImpresion, setTipoImpresion] = useState('');
  const [cantidad, setCantidad] = useState('');

  // Campo Observaciones (opcional)
  const [observaciones, setObservaciones] = useState('');

  // Estado para "Montado en:" (cuando se selecciona Vinil)
  const [montadoEn, setMontadoEn] = useState('');

  // Estados para archivos y sus imágenes (convertidos a base64)
  const [referenciaFile, setReferenciaFile] = useState(null);
  const [referenciaImage, setReferenciaImage] = useState('');
  const [disenoFile, setDisenoFile] = useState(null);
  const [disenoImage, setDisenoImage] = useState('');

  // Función auxiliar para las opciones de Terminados según material impreso
  const getTerminatedOptions = () => {
    if (printedMaterial) {
      switch (printedMaterial) {
        case "Canvas":
          return ["Corte a ras", "Sobrante"];
        case "Lona":
          return ["Bastilla", "Bastillas y Ojillos", "Ojillos", "Corte a Ras", "Bolsa", "Pendon", "Banner", "Roll Up"];
        case "Lona Mesh":
          return ["Bastillas y Ojillos", "Corte a ras", "Bolsa"];
        case "Microperforado":
          return ["Impresión", "Instalación en Muro", "Instalación en Cristal"];
        case "Vinil Tapiz":
          return ["Impresión", "Instalación en Muro"];
        case "Vinil Transparente":
          return ["Impresión", "Instalación en Muro", "Instalación en Cristal"];
        case "Electroestático":
        case "Esmerilado":
        case "Floor Graphics":
        case "Imán":
        case "Vinil de Corte":
          return [];
        default:
          return [];
      }
    } else if (papeleria) {
      return ["Brillante", "Mate", "Plastificado"];
    }
    return [];
  };

  // Manejo de archivos usando FileReader para obtener DataURL
  const handleReferenciaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenciaFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenciaImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDisenoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDisenoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDisenoImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let missingFields = [];

    if (!cliente.trim()) missingFields.push("Cliente");
    if (!fechaEntrega) missingFields.push("Fecha de entrega");

    if (!printedMaterial && !papeleria) {
      missingFields.push("Material (Impresos o Papelería)");
    } else if (printedMaterial) {
      if (!ancho || !alto) missingFields.push("Medida (ancho y alto)");
      if (printedMaterial === "Vinil" && !montadoEn) missingFields.push("Montado en (para Vinil)");
    } else if (papeleria) {
      const customMeasureProvided = ancho.trim() !== '' && alto.trim() !== '';
      if (!customMeasureProvided && !tamano) missingFields.push("Medida personalizada o Tamaño");
      if (!tipoImpresion) missingFields.push("Tipo de Impresión");
      if (!cantidad) missingFields.push("Cantidad");
    }

    if (getTerminatedOptions().length > 0 && !terminados) {
      missingFields.push("Terminados");
    }

    if (missingFields.length > 0) {
      alert("Faltan los siguientes campos obligatorios:\n" + missingFields.join(", "));
      return;
    }

    // Preparamos el objeto pedido para Firestore (sin generar ID manualmente)
    const captureDate = new Date().toLocaleString();
    const status = "Pendiente";
    
    const order = {
      cliente,
      clienteReferencia,
      ancho: papeleria ? (ancho.trim() !== '' ? ancho : "") : ancho,
      alto: papeleria ? (alto.trim() !== '' ? alto : "") : alto,
      material: printedMaterial || papeleria,
      materialTipo: printedMaterial ? "Impresos" : "Papelería",
      tamano: papeleria ? (tamano || null) : null,
      tipoImpresion: papeleria ? tipoImpresion : null,
      cantidad: papeleria ? cantidad : null,
      fechaEntrega,
      terminados,
      status,
      observaciones: observaciones ? observaciones.trim() : null,
      referenciaImage: referenciaImage || null,
      disenoImage: disenoImage || null,
      viewed: false,
      captureDate, // Guardamos la fecha de captura en texto
      timestamp: serverTimestamp()
    };

    try {
      // Agregar el pedido a la colección "orders" en Firestore
      await addDoc(collection(db, "orders"), order);
      alert("Pedido realizado con éxito!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creando el pedido:", error);
      alert("Ocurrió un error al crear el pedido.");
    }
  };

  return (
    <div className="new-order-container">
      <h2>Realizar Pedido</h2>
      <form className="new-order-form" onSubmit={handleSubmit}>
        {/* Grupo de Cliente */}
        <div className="form-group cliente-group">
          <div className="cliente-field">
            <label>
              <FiUser className="form-icon" /> Cliente <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </div>
          <div className="cliente-reference-field">
            <label>
              <FiInfo className="form-icon" /> Referencia (opcional)
            </label>
            <input
              type="text"
              placeholder="Referencia del cliente"
              value={clienteReferencia}
              onChange={(e) => setClienteReferencia(e.target.value)}
            />
          </div>
        </div>

        {/* Grupo de Medida */}
        <div className="form-group measure-group">
          <label>
            <FiCrop className="form-icon" /> Medida <span className="required">*</span>
          </label>
          <div className="measure-row">
            <input
              type="number"
              placeholder="Ancho"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              required={printedMaterial ? true : false}
            />
            <input
              type="number"
              placeholder="Alto"
              value={alto}
              onChange={(e) => setAlto(e.target.value)}
              required={printedMaterial ? true : false}
            />
            <span className="measure-label">cm</span>
          </div>
        </div>

        {/* Grupo de Material */}
        <div className="form-group material-group">
          <div className="material-column">
            <label>
              <FiLayers className="form-icon" /> Impresos <span className="required">*</span>
            </label>
            <select
              value={printedMaterial}
              onChange={(e) => {
                setPrintedMaterial(e.target.value);
                if (e.target.value) {
                  setPapeleria('');
                  setTerminados('');
                  setMontadoEn('');
                }
              }}
            >
              <option value="">Seleccione material</option>
              <option value="Canvas">Canvas</option>
              <option value="Electroestático">Electroestático</option>
              <option value="Esmerilado">Esmerilado</option>
              <option value="Floor Graphics">Floor Graphics</option>
              <option value="Imán">Imán</option>
              <option value="Lona">Lona</option>
              <option value="Lona Mesh">Lona Mesh</option>
              <option value="Microperforado">Microperforado</option>
              <option value="Vinil">Vinil</option>
              <option value="Vinil de Corte">Vinil de Corte</option>
              <option value="Vinil Tapiz">Vinil Tapiz</option>
              <option value="Vinil Transparente">Vinil Transparente</option>
            </select>
            {printedMaterial === "Vinil" && (
              <div className="montado-group">
                <label>
                  Montado en: <span className="required">*</span>
                </label>
                <select
                  value={montadoEn}
                  onChange={(e) => setMontadoEn(e.target.value)}
                  required
                >
                  <option value="">Seleccione opción</option>
                  <option value="PVC 3mm">PVC 3mm</option>
                  <option value="PVC 6mm">PVC 6mm</option>
                  <option value="Coroplast">Coroplast</option>
                  <option value="Acrílico">Acrílico</option>
                  <option value="MDF">MDF</option>
                  <option value="Instalado en Muro">Instalado en Muro</option>
                  <option value="Instalado en Cristal">Instalado en Cristal</option>
                  <option value="Instalado en Vehículo">Instalado en Vehículo</option>
                </select>
              </div>
            )}
          </div>
          <div className="material-column">
            <label>
              <FiLayers className="form-icon" /> Papelería <span className="required">*</span>
            </label>
            <select
              value={papeleria}
              onChange={(e) => {
                setPapeleria(e.target.value);
                if (e.target.value) {
                  setPrintedMaterial('');
                  setTerminados('');
                }
              }}
            >
              <option value="">Seleccione papelería</option>
              <option value="Autocopiable">Autocopiable</option>
              <option value="Bond">Bond</option>
              <option value="Cocuche 250 grs.">Cocuche 250 grs.</option>
              <option value="Couche 130 grs.">Couche 130 grs.</option>
              <option value="Couche 300 grs.">Couche 300 grs.</option>
              <option value="Digilux">Digilux</option>
              <option value="Fasson">Fasson</option>
            </select>
          </div>
        </div>

        {/* Grupo extra para Papelería */}
        {papeleria && (
          <div className="form-group papeleria-extra">
            <div className="papeleria-field">
              <label>
                Tamaño {(!(ancho.trim() && alto.trim()) && <span className="required">*</span>)}
              </label>
              <select value={tamano} onChange={(e) => setTamano(e.target.value)}>
                <option value="">Seleccione tamaño</option>
                <option value="Cuarto de Carta">Cuarto de Carta</option>
                <option value="Media Carta">Media Carta</option>
                <option value="Carta">Carta</option>
                <option value="A4">A4</option>
                <option value="Oficio">Oficio</option>
                <option value="Legal">Legal</option>
                <option value="Medio Oficio">Medio Oficio</option>
                <option value="Tabloide">Tabloide</option>
                <option value="Tabloide Extendido">Tabloide Extendido</option>
              </select>
            </div>
            <div className="papeleria-field">
              <label>
                Tipo de Impresión <span className="required">*</span>
              </label>
              <select
                value={tipoImpresion}
                onChange={(e) => setTipoImpresion(e.target.value)}
                required
              >
                <option value="">Seleccione tipo de impresión</option>
                <option value="Solo Frente">Solo Frente</option>
                <option value="Frente y Vuelta">Frente y Vuelta</option>
              </select>
            </div>
            <div className="papeleria-field">
              <label>
                Cantidad <span className="required">*</span>
              </label>
              <input
                type="number"
                placeholder="Cantidad de hojas"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Campo Fecha de entrega */}
        <div className="form-group">
          <label>
            <FiCalendar className="form-icon" /> Fecha de entrega <span className="required">*</span>
          </label>
          <input
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            min={today}
            required
          />
        </div>

        {/* Campo Terminados */}
        <div className="form-group">
          <label>
            <FiCheckCircle className="form-icon" /> Terminados {getTerminatedOptions().length > 0 && <span className="required">*</span>}
          </label>
          {getTerminatedOptions().length > 0 ? (
            <select
              value={terminados}
              onChange={(e) => setTerminados(e.target.value)}
              required
            >
              <option value="">Seleccione terminados</option>
              {getTerminatedOptions().map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <p style={{ fontStyle: "italic", color: "#aaa" }}>
              No aplica terminados para este material
            </p>
          )}
        </div>

        {/* Campo Observaciones (opcional) */}
        <div className="form-group">
          <label>Observaciones</label>
          <textarea
            placeholder="Ingrese observaciones sobre el trabajo (opcional)"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows="3"
          />
        </div>

        {/* Grupo para Referencia y Diseño */}
        <div className="form-group file-group">
          <div className="file-column">
            <label>
              <FiImage className="form-icon" /> Referencia <small>(Captura de pantalla)</small>
            </label>
            <div className="custom-file">
              <input
                type="file"
                accept="image/*"
                id="referenciaFile"
                onChange={handleReferenciaChange}
              />
              <label htmlFor="referenciaFile" className="upload-button">
                Subir archivo
              </label>
              {referenciaFile && (
                <div className="file-preview">
                  <img
                    src={referenciaImage}
                    alt="Vista previa de Referencia"
                    className="preview-img"
                  />
                  <p>Archivo: {referenciaFile.name}</p>
                </div>
              )}
            </div>
          </div>
          <div className="file-column">
            <label>
              <FiMonitor className="form-icon" /> Diseño <small>(Captura de pantalla)</small>
            </label>
            <div className="custom-file">
              <input
                type="file"
                accept="image/*"
                id="disenoFile"
                onChange={handleDisenoChange}
              />
              <label htmlFor="disenoFile" className="upload-button">
                Subir archivo
              </label>
              {disenoFile && (
                <div className="file-preview">
                  <img
                    src={disenoImage}
                    alt="Vista previa de Diseño"
                    className="preview-img"
                  />
                  <p>Archivo: {disenoFile.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-order-button">
          REALIZAR PEDIDO
        </button>
      </form>
    </div>
  );
};

export default NewOrder;
