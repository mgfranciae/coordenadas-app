import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix ícono
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Mapa = ({ usuarioId }) => {
  const [coordenadas, setCoordenadas] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const URL_WEBSOCKET = 'ws://' + process.env.REACT_APP_BACKEND_URL;
    const websocket = new WebSocket(URL_WEBSOCKET);

    websocket.onopen = () => {
      console.log('✅ Conectado al servidor WebSocket');
    };

    websocket.onmessage = (evento) => {
      try {
        const datos = JSON.parse(evento.data);
        setCoordenadas(datos);
        setError('');
      } catch (e) {
        setError('Error al procesar los datos recibidos');
      }
    };

    websocket.onerror = () => {
      setError('No se pudo conectar con el servidor');
    };

    websocket.onclose = () => {
      console.log('WebSocket cerrado');
    };

    return () => {
      websocket.close();
    };
  }, []);

  if (!coordenadas) {
    return (
      <div className="placeholder-mapa">
        <p>Esperando coordenadas...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[coordenadas.latitud, coordenadas.longitud]}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coordenadas.latitud, coordenadas.longitud]}>
        <Popup>
          Lat: {coordenadas.latitud.toFixed(4)}<br />
          Lng: {coordenadas.longitud.toFixed(4)}<br />
          {new Date(coordenadas.timestamp).toLocaleTimeString()}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Mapa;