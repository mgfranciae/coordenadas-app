import {
  obtenerUltimasCoordenadas,
  obtenerIntervaloEnvio
} from './almacenCoordenadas.js';

let intervaloId = null;
let clientes = new Set();

export const configurarClientes = (nuevosClientes) => {
  clientes = nuevosClientes;
};

export const iniciarEmisor = () => {
  detenerEmisor();
  intervaloId = setInterval(() => {
    const coords = obtenerUltimasCoordenadas();
    if (!coords) return;

    const mensaje = JSON.stringify(coords);
    const desconectados = [];

    clientes.forEach((cliente) => {
      if (cliente.readyState === cliente.OPEN) {
        cliente.send(mensaje);
      } else {
        desconectados.push(cliente);
      }
    });

    desconectados.forEach(cliente => clientes.delete(cliente));
  }, obtenerIntervaloEnvio());
};

export const detenerEmisor = () => {
  if (intervaloId) {
    clearInterval(intervaloId);
    intervaloId = null;
  }
};

export const actualizarIntervalo = () => {
  iniciarEmisor();
};