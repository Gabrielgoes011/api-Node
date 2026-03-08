import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Injetando estilos globais para remover as margens padrão do navegador (bordas brancas)
const globalStyle = document.createElement('style');
globalStyle.innerHTML = `
  body { margin: 0; padding: 0; background-color: #f0f2f5; }
  * { box-sizing: border-box; }
`;
document.head.appendChild(globalStyle);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);