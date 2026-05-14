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

export interface ClinicalResult {
  prediction: number;
  risk_percentage: number;
  risk_level: string;
  feature_contributions: Array<{
    feature: string;
    value: number;
    contribution: number;
    impact: string;
  }>;
  top_insights: Array<{
    feature: string;
    contribution_pct: number;
    description: string;
  }>;
  model_info: {
    accuracy: number;
    dataset: string;
    samples: number;
  };
}

export interface LifestyleResult {
  risk_score: number;
  metabolic_score: number;
  risk_level: string;
  recommendation: string;
  insights: string[];
  positive_feedback: string[];
  feature_importance: Array<{ feature: string; importance: number }>;
}

export interface InsightsData {
  insights: string[];
  timestamp: string;
}

export interface DashboardSummary {
  clinical_risk: number;
  lifestyle_risk: number;
  metabolic_score: number;
  last_updated: string;
  alerts: string[];
}

export const api = {
  clinical: {
    predict: (data: Record<string, number>) =>
      fetchAPI<ClinicalResult>("/api/clinical/predict", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getFeatureImportance: () =>
      fetchAPI<Array<{ feature: string; importance: number }>>("/api/clinical/feature-importance"),
  },
  lifestyle: {
    predict: (data: Record<string, number>) =>
      fetchAPI<LifestyleResult>("/api/lifestyle/predict", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getFeatureImportance: () =>
      fetchAPI<Array<{ feature: string; importance: number }>>("/api/lifestyle/feature-importance"),
  },
  insights: {
    generate: () => fetchAPI<InsightsData>("/api/insights/generate"),
  },
  dashboard: {
    summary: () => fetchAPI<DashboardSummary>("/api/dashboard/summary"),
  },
};