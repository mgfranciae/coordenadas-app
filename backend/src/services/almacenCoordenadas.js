// Almacena las últimas coordenadas y el intervalo de envío
let ultimasCoordenadas = null;
let intervaloEnvioMs = 2000; // valor por defecto

export const guardarCoordenadas = (latitud, longitud) => {
  ultimasCoordenadas = {
    latitud,
    longitud,
    timestamp: Date.now()
  };
};

export const obtenerUltimasCoordenadas = () => {
  return ultimasCoordenadas;
};

export const establecerIntervaloEnvio = (ms) => {
  if (ms < 500) ms = 500; // mínimo 500ms
  intervaloEnvioMs = ms;
};

export const obtenerIntervaloEnvio = () => {
  return intervaloEnvioMs;
};