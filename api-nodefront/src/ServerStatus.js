import { useState, useEffect } from 'react';
import axios from 'axios';

const ServerStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline'

  const checkHealth = async () => {
    try {
      // Bate na rota raiz definida no seu app.js
      await axios.get('http://localhost:3000/');
      setStatus('online');
    } catch (error) {
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    // Configura um intervalo para verificar a cada 10 segundos
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Configuração visual para cada estado
  const config = {
    checking: { color: '#ffc107', text: 'Verificando...', shadow: '0 0 5px #ffc107' },
    online:   { color: '#28a745', text: 'Servidor Online', shadow: '0 0 5px #28a745' },
    offline:  { color: '#dc3545', text: 'Servidor Offline', shadow: '0 0 5px #dc3545' }
  };

  const current = config[status];

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: 'white',
      borderRadius: '50px', // Formato de pílula
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      fontSize: '13px',
      fontWeight: '600',
      color: '#555',
      border: '1px solid #eee',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%',
        backgroundColor: current.color, boxShadow: current.shadow,
        transition: 'background-color 0.3s ease'
      }} />
      <span>{current.text}</span>
    </div>
  );
};

export default ServerStatus;