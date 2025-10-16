import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Auth = ({ onLogin }) => {
  const [tipo, setTipo] = useState('login'); // 'login', 'registro', 'recuperar'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [placa, setPlaca] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMensaje('Error: ' + (error.message || 'Credenciales inválidas'));
    } else {
      onLogin(data.user);
    }
    setCargando(false);
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          direccion: direccion.trim(),
          telefono: telefono.trim(),
          placa: placa.trim().toUpperCase()
        },
        emailRedirectTo: `${window.location.origin}/confirmar-email`
      }
    });

    if (error) {
      setMensaje('Error: ' + error.message);
    } else if (data.user) {
      setMensaje('✅ Registro exitoso. Por favor, confirma tu email para continuar.');
      setTipo('login');
    } else {
      setMensaje('📧 Revisa tu bandeja de entrada para confirmar tu cuenta.');
    }
    setCargando(false);
  };

  const manejarRecuperar = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-password`
    });

    if (error) {
      setMensaje('Error: ' + error.message);
    } else {
      setMensaje('✅ Email de recuperación enviado. Revisa tu bandeja de entrada.');
    }
    setCargando(false);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '80px auto', padding: '25px', border: '1px solid #eee', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {tipo === 'login' && 'Iniciar Sesión'}
        {tipo === 'registro' && 'Crear Cuenta'}
        {tipo === 'recuperar' && 'Recuperar Contraseña'}
      </h2>

      {mensaje && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: mensaje.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: mensaje.includes('Error') ? '#c62828' : '#2e7d32',
          borderRadius: '4px'
        }}>
          {mensaje}
        </div>
      )}

      {tipo === 'login' && (
        <form onSubmit={manejarLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button
            type="submit"
            disabled={cargando}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#1976d2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: cargando ? 'not-allowed' : 'pointer' 
            }}
          >
            {cargando ? 'Procesando...' : 'Ingresar'}
          </button>
        </form>
      )}

      {tipo === 'registro' && (
        <form onSubmit={manejarRegistro}>
          <input
            type="text"
            placeholder="Nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{ width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="Placa vehicular (6 caracteres)"
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            required
            maxLength="6"
            style={{ width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="Dirección (opcional)"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="tel"
            placeholder="Teléfono (opcional)"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button
            type="submit"
            disabled={cargando}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#388e3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: cargando ? 'not-allowed' : 'pointer' 
            }}
          >
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      )}

      {tipo === 'recuperar' && (
        <form onSubmit={manejarRecuperar}>
          <p style={{ marginBottom: '15px', color: '#555' }}>
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <input
            type="email"
            placeholder="Email registrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button
            type="submit"
            disabled={cargando}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#f57c00', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: cargando ? 'not-allowed' : 'pointer' 
            }}
          >
            {cargando ? 'Enviando...' : 'Recuperar Contraseña'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
        {tipo !== 'login' ? (
          <button
            onClick={() => setTipo('login')}
            style={{ 
              color: '#1976d2', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              textDecoration: 'underline' 
            }}
          >
            ← Volver a Iniciar Sesión
          </button>
        ) : (
          <>
            <div style={{ marginBottom: '10px' }}>
              <button
                onClick={() => setTipo('registro')}
                style={{ 
                  color: '#388e3c', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  textDecoration: 'underline' 
                }}
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
            <button
              onClick={() => setTipo('recuperar')}
              style={{ 
                color: '#f57c00', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                textDecoration: 'underline' 
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;