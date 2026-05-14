const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const WS_BASE_URL = API_BASE_URL.replace("http", "ws");

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  wsUrl: WS_BASE_URL,
  endpoints: {
    clinical: {
      predict: `${API_BASE_URL}/api/clinical/predict`,
      featureImportance: `${API_BASE_URL}/api/clinical/feature-importance`,
    },
    lifestyle: {
      predict: `${API_BASE_URL}/api/lifestyle/predict`,
      featureImportance: `${API_BASE_URL}/api/lifestyle/feature-importance`,
    },
    insights: {
      generate: `${API_BASE_URL}/api/insights/generate`,
    },
    dashboard: {
      summary: `${API_BASE_URL}/api/dashboard/summary`,
    },
    chat: {
      send: `${API_BASE_URL}/api/chat`,
    },
    websocket: {
      stream: `${WS_BASE_URL}/ws/stream`,
    },
  },
};

export default API_CONFIG;