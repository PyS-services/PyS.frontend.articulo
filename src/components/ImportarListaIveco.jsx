// src/components/ImportarListaIveco.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './ImportarListaIveco.css'; // Importa el archivo CSS

const ImportarListaIveco = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cotizacionDolar, setCotizacionDolar] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processId, setProcessId] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Maneja la selección del archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
    } else {
      alert('Por favor, selecciona un archivo con extensión .xlsx');
      setSelectedFile(null);
    }
  };

  // Maneja el cambio en la cotización del dólar
  const handleCotizacionChange = (event) => {
    const value = event.target.value;
    // Solo permite números y un punto decimal
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === '' || regex.test(value)) {
      setCotizacionDolar(value);
    }
  };

  // Formatea el valor al perder el foco
  const handleCotizacionBlur = () => {
    if (cotizacionDolar !== '') {
      const numero = parseFloat(cotizacionDolar);
      if (!isNaN(numero)) {
        setCotizacionDolar(`$${numero.toFixed(2)}`);
      }
    }
  };

  // Elimina el formato al ganar el foco
  const handleCotizacionFocus = () => {
    if (cotizacionDolar.startsWith('$')) {
      setCotizacionDolar(cotizacionDolar.replace('$', ''));
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Por favor, selecciona un archivo .xlsx');
      return;
    }

    // Extrae el valor numérico de cotizacionDolar
    const cotizacionNumerica = cotizacionDolar.replace('$', '');
    if (!cotizacionNumerica || parseFloat(cotizacionNumerica) <= 0) {
      alert('Por favor, ingresa una cotización del dólar válida');
      return;
    }

    setIsUploading(true);
    setIsProcessing(false);
    setProcessId(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('cotizacionDolar', cotizacionNumerica);

    try {
      // Reemplaza con la URL de tu backend
      const response = await axios.post(
        'http://localhost:8091/api/articulo-service/import/listaIveco/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      const receivedProcessId = response.data; // Captura el processId devuelto
      setProcessId(receivedProcessId);

      setIsUploading(false);
      setIsProcessing(true);
      setProcessingProgress(0);

      // Inicia el polling para consultar el estado del procesamiento
      checkProcessingStatus(receivedProcessId);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Hubo un error al subir el archivo');
      setIsUploading(false);
      setIsProcessing(false);
    } finally {
      setUploadProgress(0);
    }
  };

  // Función para consultar el estado del procesamiento
  const checkProcessingStatus = (processId) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:8091/api/articulo-service/import/listaIveco/status/${processId}`
        );

        const { status, progress } = response.data;

        setProcessingProgress(progress);

        if (status === 'Completado') {
          clearInterval(intervalId);
          setIsProcessing(false);
          setProcessingProgress(100);
          alert('Archivo procesado exitosamente');
        } else if (status === 'Error') {
          clearInterval(intervalId);
          setIsProcessing(false);
          alert('Hubo un error al procesar el archivo');
        }
        // Si el estado es 'En Progreso', el polling continúa
      } catch (error) {
        console.error('Error al consultar el estado:', error);
        clearInterval(intervalId);
        setIsProcessing(false);
        alert('Hubo un error al consultar el estado del procesamiento');
      }
    }, 2000); // Consulta cada 2 segundos
  };

  return (
    <div className="importar-lista-iveco">
      <h2>Importar Lista Iveco</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo para seleccionar el archivo */}
        <div className="form-group">
          <label htmlFor="fileInput" className="form-label">
            Selecciona un archivo .xlsx
          </label>
          <input
            type="file"
            className="form-control"
            id="fileInput"
            accept=".xlsx"
            onChange={handleFileChange}
            required
          />
        </div>
        {/* Fila para cotización y botón */}
        <div className="form-row">
          {/* Cotización del Dólar */}
          <div className="form-group cotizacion-group">
            <label htmlFor="cotizacionDolar" className="form-label">
              Cotización del Dólar (ARS)
            </label>
            <input
              type="text"
              className="form-control input-right"
              id="cotizacionDolar"
              value={cotizacionDolar}
              onChange={handleCotizacionChange}
              onBlur={handleCotizacionBlur}
              onFocus={handleCotizacionFocus}
              placeholder="Cotización del dólar"
              required
            />
          </div>
          {/* Botón de envío */}
          <div className="form-group button-group">
            <button
              type="submit"
              className="btn btn-primary submit-button"
              disabled={isUploading || isProcessing}
            >
              {isUploading
                ? `Subiendo... ${uploadProgress}%`
                : isProcessing
                  ? 'Procesando...'
                  : 'Subir Archivo'}
            </button>
          </div>
        </div>
      </form>

      {/* Indicadores de carga */}
      {(isUploading || isProcessing) && (
        <div className="loading-indicator">
          {isUploading && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${uploadProgress}%`}
              </div>
            </div>
          )}
          {isProcessing && (
            <div className="processing-progress">
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                  role="progressbar"
                  style={{ width: `${processingProgress}%` }}
                  aria-valuenow={processingProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {`Procesando... ${processingProgress}%`}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportarListaIveco;
