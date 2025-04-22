import React, { useState } from "react";


function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Función para manejar la selección de archivos de audio
  const handleAudioChange = (e) => {
    setAudioFile(e.target.files[0]);
    setError(""); // Limpiamos el mensaje de error
  };

  // Función para enviar el audio al backend y obtener la transcripción
  const transcribeAudio = async () => {
    if (!audioFile) {
      setError("Por favor, selecciona un archivo de audio.");
      return; // Si no hay archivo seleccionado, mostramos el error y detenemos la ejecución
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    setIsLoading(true); // Activamos el estado de cargando
    setError(""); // Limpiamos cualquier error previo

    try {
      // Enviamos el audio al backend para la transcripción
      const response = await fetch("https://transcriptor-backend.onrender.com/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar el audio.");
      }

      // Creamos un blob a partir de la respuesta y convertimos a texto
      const blob = await response.blob();
      const text = await blob.text();
      setTranscription(text);

      // Crear descarga automática del archivo .txt con la transcripción
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
      setError(err.message); // Mostramos el error si algo sale mal
    } finally {
      setIsLoading(false); // Desactivamos el estado de cargando
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Transcripción de Audio</h1>

        {/* Campo para seleccionar el archivo de audio */}
        <input
          type="file"
          accept="audio/wav"
          onChange={handleAudioChange}
          className="w-full border p-2 rounded-lg"
        />

        {/* Botón para iniciar la transcripción */}
        <button
          onClick={transcribeAudio}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-full transition duration-300"
        >
          {isLoading ? "Transcribiendo..." : "Transcribir y Descargar"}
        </button>

        {/* Mostrar el enlace al convertidor MP4 a WAV */}
        <div className="text-center">
          <a
            href="https://online-audio-converter.com/sp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-4 block"
          >
            Convierte tu MP4 a WAV aquí
          </a>
        </div>

        {/* Mostrar errores si los hay */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Mostrar la transcripción si está disponible */}
        {transcription && (
          <div className="text-sm text-gray-800 whitespace-pre-wrap border-t pt-4">
            <h2 className="font-semibold mb-2">Texto transcrito:</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;