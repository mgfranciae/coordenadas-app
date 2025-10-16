import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Bienvenido from './components/Bienvenido';
import Mapa from './components/Mapa';
import { supabase } from './lib/supabaseClient';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [mostrarMapa, setMostrarMapa] = useState(false);

useEffect(() => {
  const verificarSesion = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUsuario(session?.user || null);
    setCargandoSesion(false);
  };
  verificarSesion();

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUsuario(session?.user || null);
      if (!session) setMostrarMapa(false);
    }
  );

  return () => subscription.unsubscribe();
}, []);

  const manejarLogin = (user) => {
    setUsuario(user);
  };

  const manejarLogout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    setMostrarMapa(false);
  };

  const irAlMapa = () => {
    setMostrarMapa(true);
  };

  if (cargandoSesion) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Cargando...</div>;
  }

  if (!usuario) {
    return <Auth onLogin={manejarLogin} />;
  }

  if (!mostrarMapa) {
    return <Bienvenido usuario={usuario} onLogout={manejarLogout} onContinuar={irAlMapa} />;
  }

  // === LÓGICA DEL MAPA (solo se renderiza tras hacer clic en "Ir al Mapa") ===
  const URL_API = 'http://' + process.env.REACT_APP_BACKEND_URL + '/api';

  const manejarAjusteIntervalo = (e) => {
    e.preventDefault();
    const input = e.target.elements.intervalo;
    const valor = Number(input.value);
    if (valor < 500) {
      alert('El intervalo debe ser al menos 500 ms');
      return;
    }

    fetch(`${URL_API}/refrescar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intervalo_ms: valor })
    })
      .then(res => res.json())
      .then(data => {
        alert(`✅ Intervalo ajustado a ${data.intervalo_ms} ms`);
        input.value = data.intervalo_ms;
      })
      .catch(err => {
        console.error('Error al ajustar el intervalo:', err);
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📍 Mapa en Tiempo Real</h1>
        <button
          onClick={manejarLogout}
          style={{
            padding: '6px 12px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <form onSubmit={manejarAjusteIntervalo} style={{ marginBottom: '20px' }}>
        <label>
          Intervalo de actualización (ms):
          <input
            name="intervalo"
            type="number"
            min="500"
            defaultValue="2000"
            style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Aplicar
        </button>
      </form>

      <Mapa usuarioId={usuario.id} />
    </div>
  );
}

export default App;