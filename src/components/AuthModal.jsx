import React, { useState } from 'react';
import { Mail, Lock, Sparkles, Sun, Moon, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function AuthModal({ onLoginSuccess, theme, toggleTheme }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const result = await apiService.register(email, password);
        if (result.error) {
          setErrorMsg(result.error);
        } else {
          setSuccessMsg(result.message || 'Cadastro realizado com sucesso! Faça seu login.');
          setIsRegister(false);
          setPassword('');
        }
      } else {
        const result = await apiService.login(email, password);
        if (result.error) {
          setErrorMsg(result.error);
        } else {
          const userEmail = email.trim().toLowerCase();
          localStorage.setItem('barbie_logged_in', userEmail);
          onLoginSuccess(userEmail);
        }
      }
    } catch (err) {
      setErrorMsg('Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card">
        <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            style={{ width: '36px', height: '36px' }}
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <img 
          src="/images/logoBarbie.png" 
          alt="Barbie Logo" 
          className="auth-logo"
        />
        
        <h2 className="auth-title">
          {isRegister ? 'Criar sua Conta Barbie' : 'Bem-vinda(o) ao Barbie World'}
        </h2>

        {errorMsg && (
          <div style={{ background: '#ff4d4d', color: 'white', padding: '0.6rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#2e7d32', color: 'white', padding: '0.6rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              placeholder="Digite sua senha"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <Loader2 size={18} className="spinner-icon" /> : <Sparkles size={18} />}
            <span>{isRegister ? 'Cadastrar' : 'Entrar'}</span>
          </button>
        </form>

        <div className="auth-toggle-text">
          {isRegister ? (
            <>
              Já tem uma conta?
              <button 
                type="button" 
                className="toggle-btn"
                onClick={() => { setIsRegister(false); setErrorMsg(''); setSuccessMsg(''); }}
              >
                Entre aqui
              </button>
            </>
          ) : (
            <>
              Não tem uma conta?
              <button 
                type="button" 
                className="toggle-btn"
                onClick={() => { setIsRegister(true); setErrorMsg(''); setSuccessMsg(''); }}
              >
                Cadastre-se
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
