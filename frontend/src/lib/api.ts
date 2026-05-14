const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  clinical: {
    predict: (data: Record<string, number>) =>
      fetchAPI<any>("/api/clinical/predict", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getFeatureImportance: () =>
      fetchAPI<any[]>("/api/clinical/feature-importance"),
  },
  lifestyle: {
    predict: (data: Record<string, number>) =>
      fetchAPI<any>("/api/lifestyle/predict", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getFeatureImportance: () =>
      fetchAPI<any[]>("/api/lifestyle/feature-importance"),
  },
  insights: {
    generate: () => fetchAPI<{ insights: string[] }>("/api/insights/generate"),
  },
  dashboard: {
    summary: () => fetchAPI<any>("/api/dashboard/summary"),
  },
};