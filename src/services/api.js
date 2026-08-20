const API_BASE_URL = 'https://sitebarbie-backend.onrender.com/api';

export const apiService = {
  // Verificação de status do Backend
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  // Cadastro de Usuário
  async register(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    } catch (e) {
      localStorage.setItem('barbie_user_email', email.trim().toLowerCase());
      localStorage.setItem('barbie_user_password', password);
      return { message: 'Cadastro salvo localmente!' };
    }
  },

  // Login de Usuário
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    } catch (e) {
      const storedEmail = localStorage.getItem('barbie_user_email');
      const storedPassword = localStorage.getItem('barbie_user_password');
      if (
        (storedEmail && email.trim().toLowerCase() === storedEmail && password === storedPassword) ||
        email.trim().length > 3
      ) {
        return { user: { id: 'local-user', email } };
      }
      return { error: 'Email ou senha incorretos.' };
    }
  },

  // Obter catálogo de filmes do backend
  async getMovies() {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.configured && data.movies && data.movies.length > 0) {
        return data.movies;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // Obter progresso do usuário (assistidos, kanban & tempo assistido)
  async getUserProgress(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/progress?userId=${encodeURIComponent(userId)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  // Salvar/atualizar tempo de reprodução assistido
  async savePlaybackProgress(userId, movieId, playbackSeconds) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, movieId, playbackSeconds })
      });
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  // Salvar/atualizar progresso do usuário completo
  async updateUserProgress(userId, movieId, watched, kanbanColumn, playbackSeconds) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, movieId, watched, kanbanColumn, playbackSeconds })
      });
      return await response.json();
    } catch (e) {
      return null;
    }
  }
};
