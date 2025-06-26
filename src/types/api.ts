// src/types/api.ts

// Define la estructura para los parámetros de consulta (query parameters)
export type QueryParams = {
  [key: string]: string | number | boolean | undefined;
};

// Define la estructura genérica para la respuesta de la API desde tu backend
export interface APIResponse<T> {
  success: boolean;
  data?: T; // Los datos reales devueltos por la API
  message: string;
  status: number; // Código HTTP de la respuesta
}

// Puedes añadir más tipos genéricos aquí si tu API tiene respuestas estandarizadas