// frontend/src/components/Bienvenido.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Bienvenido = ({ usuario, onLogout, onContinuar }) => {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', usuario.id)
        .single();

      if (!error) {
        setPerfil(data);
      }
      setCargando(false);
    };

    cargarPerfil();
  }, [usuario.id]);

  if (cargando) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando datos...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '25px', fontFamily: 'sans-serif' }}>
      <h1>👋 ¡Bienvenido, {perfil?.nombres || usuario.email}!</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Tus datos:</h3>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Nombres:</strong> {perfil?.nombres || '—'}</p>
        <p><strong>Apellidos:</strong> {perfil?.apellidos || '—'}</p>
        <p><strong>Placa vehicular:</strong> {perfil?.placa || '—'}</p>
        <p><strong>Dirección:</strong> {perfil?.direccion || '—'}</p>
        <p><strong>Teléfono:</strong> {perfil?.telefono || '—'}</p>
      </div>

      <div style={{ marginTop: '25px', textAlign: 'center' }}>
        {/* ✅ ESTE ES EL BOTÓN QUE DEBES VER */}
        <button
          onClick={onContinuar}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '15px'
          }}
        >
          Ir al Mapa
        </button>
        
        <button
          onClick={onLogout}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Bienvenido;