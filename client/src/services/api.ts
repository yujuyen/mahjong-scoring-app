import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface Player {
  id: number;
  session_id: number;
  name: string;
}

export interface Session {
  id: number;
  name: string;
  created_at: string;
  status: string;
  players?: Player[];
}

export interface Hand {
  id: number;
  session_id: number;
  winner_id: number;
  loser_id?: number;
  hand_type: string;
  fan_count: number;
  base_points: number;
  total_points: number;
  image_path?: string;
  notes?: string;
  created_at: string;
  winner_name?: string;
  loser_name?: string;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  total_score: number;
}

export interface HandType {
  key: string;
  name: string;
  fan: number;
  description: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sessionAPI = {
  createSession: async (name: string, players: string[]) => {
    const response = await api.post('/sessions', { name, players });
    return response.data;
  },

  getSessions: async (): Promise<Session[]> => {
    const response = await api.get('/sessions');
    return response.data;
  },

  getSession: async (id: number): Promise<Session> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  completeSession: async (id: number) => {
    const response = await api.patch(`/sessions/${id}/complete`);
    return response.data;
  },

  deleteSession: async (id: number) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },

  getLeaderboard: async (sessionId: number): Promise<LeaderboardEntry[]> => {
    const response = await api.get(`/sessions/${sessionId}/leaderboard`);
    return response.data;
  },
};

export const handAPI = {
  submitHand: async (formData: FormData) => {
    const response = await api.post('/hands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSessionHands: async (sessionId: number): Promise<Hand[]> => {
    const response = await api.get(`/hands/session/${sessionId}`);
    return response.data;
  },

  getHand: async (id: number): Promise<Hand> => {
    const response = await api.get(`/hands/${id}`);
    return response.data;
  },

  updateHand: async (id: number, formData: FormData) => {
    const response = await api.put(`/hands/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteHand: async (id: number) => {
    const response = await api.delete(`/hands/${id}`);
    return response.data;
  },
};

export const getHandTypes = async (): Promise<HandType[]> => {
  const response = await api.get('/hand-types');
  return response.data;
};

export default api;
