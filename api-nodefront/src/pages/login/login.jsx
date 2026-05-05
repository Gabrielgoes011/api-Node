import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../config/api';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });

      // Salva o token no localStorage para o interceptor usar nas próximas chamadas
      localStorage.setItem('token', res.data.token);

      toast.success('Login bem-sucedido! Redirecionando...');

      // Atualiza o estado de login e redireciona
      onLogin(true);
      
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (error) {
      const msg = error.response?.data?.erro || 'Erro ao realizar login.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          .login-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .login-card {
            background: #1e293b;
            padding: 2.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 400px;
          }
          .login-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .login-header h2 {
            margin: 0;
            color: #f8fafc;
            font-size: 1.8rem;
          }
          .login-header p {
            margin: 0.5rem 0 0;
            color: #94a3b8;
            font-size: 0.95rem;
          }
          .form-group {
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
          }
          .form-group label {
            margin-bottom: 0.5rem;
            color: #cbd5e1;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .form-group input {
            padding: 0.85rem;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 6px;
            font-size: 1rem;
            transition: all 0.3s ease;
            outline: none;
            color: #f8fafc;
          }
          .form-group input:focus {
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          }
          .login-button {
            width: 100%;
            padding: 0.85rem;
            border: none;
            border-radius: 6px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
          }
          .login-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
          }
        `}
      </style>
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h2>Bem-vindo</h2>
            <p>Faça login para acessar o sistema</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
