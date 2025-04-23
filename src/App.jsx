import React, { useState } from "react";
import "./App.css"; // Estilos específicos de este componente

function App() {
  // Estados del componente
  const [audioFile, setAudioFile] = useState(null); // Guarda el archivo seleccionado
  const [transcription, setTranscription] = useState(""); // Texto transcrito
  const [isLoading, setIsLoading] = useState(false); // Controla el estado de carga
  const [error, setError] = useState(""); // Muestra mensajes de error

  // Al seleccionar un archivo de audio, lo guardamos en el estado
  const handleAudioChange = (e) => {
    setAudioFile(e.target.files[0]);
    setError(""); // Limpiamos cualquier error anterior
  };

  // Lógica para enviar el archivo al backend y recibir la transcripción
  const transcribeAudio = async () => {
    if (!audioFile) {
      setError("Por favor, selecciona un archivo de audio.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    setIsLoading(true);
    setError("");

    try {
      // Petición al backend
      const response = await fetch("https://transcriptor-backend.onrender.com/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar el audio.");
      }

      const blob = await response.blob(); // Recibimos la transcripción como blob
      const text = await blob.text(); // Convertimos a texto y lo mostramos
      setTranscription(text);

      // Creamos y lanzamos la descarga del archivo de texto
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transcription.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message); // Mostramos cualquier error que ocurra
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>Transcripción de Audio</h1>

        {/* Selector de archivo */}
        <input
          type="file"
          accept="audio/wav"
          onChange={handleAudioChange}
        />

        {/* Botón para iniciar la transcripción */}
        <button onClick={transcribeAudio} disabled={isLoading}>
          {isLoading ? "Transcribiendo..." : "Transcribir y Descargar"}
        </button>

        {/* Enlace a convertidor externo de MP4 a WAV */}
        <div className="converter-link">
          <a
            href="https://online-audio-converter.com/sp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Convierte tu MP4 a WAV aquí
          </a>
        </div>

        {/* Error si lo hay */}
        {error && <p className="error">{error}</p>}

        {/* Transcripción mostrada en pantalla */}
        {transcription && (
          <div className="transcription">
            <h2>Texto transcrito:</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
