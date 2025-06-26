// src/lib/api.ts
import { API_ENDPOINTS } from '@/constants/appConfig'; // Usamos un alias '@' que Next.js configura por defecto
import { APIResponse, QueryParams } from '@/types/api'; // Necesitamos definir estos tipos en src/types/api.ts

/**
 * Función genérica para realizar peticiones GET a la API.
 * Se encarga de la mayoría de las peticiones GET que esperan JSON.
 * @param url La URL completa del endpoint.
 * @param params Parámetros de consulta (query parameters) opcionales.
 * @param token Token de autenticación (opcional, para rutas protegidas).
 * @returns Una promesa que resuelve con los datos de la API.
 */
export async function fetchApi<T>(
  url: string,
  params?: QueryParams,
  token?: string
): Promise<APIResponse<T>> {
  let fullUrl = url;
  if (params) {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    fullUrl = `${url}?${queryString}`;
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json', // Por defecto, esperamos JSON
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, { headers });
    
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // Lógica para verificar Content-Type: CRÍTICA para evitar errores si no es JSON
    const contentType = response.headers.get('content-type');
    let data: any; // Usamos 'any' porque el tipo puede variar (JSON, string)

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Si la respuesta no es JSON, y la respuesta no es OK, leemos como texto para el mensaje de error.
      // Si es OK pero no es JSON (ej. un GET a un archivo, que debería usar fetchImageApi), lo manejamos como texto aquí.
      data = await response.text(); 
      console.warn(`fetchApi: Respuesta no JSON para ${url}. Content-Type: ${contentType}.`);
      if (!response.ok) {
        // Para errores, data.message podría no existir si no es JSON, así que usamos el texto directamente.
        return { success: false, data: undefined, message: data || `Error en la petición (Código: ${response.status}).`, status: response.status };
      }
      // Para respuestas GET exitosas que no son JSON, 'data' contendrá el texto.
      // Sin embargo, para imágenes, es mejor usar 'fetchImageApi'.
    }
    // >>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    if (!response.ok) {
      // Si la respuesta no es OK (ej. 404, 500), lanzar un error con el mensaje de la API
      return { success: false, data: undefined, message: data.message || `Error en la petición (Código: ${response.status}).`, status: response.status };
    }

    return { success: true, data: data, message: 'Petición exitosa.', status: response.status };
  } catch (error: any) {
    console.error(`Error fetching from ${fullUrl}:`, error);
    return { success: false, data: undefined, message: error.message || 'Error de red o servidor.', status: 500 };
  }
}

/**
 * Función especializada para realizar peticiones GET a la API que devuelven IMÁGENES (Blob).
 * Retorna la URL del Blob de la imagen, lista para usar en un tag <img>.
 * @param url La URL completa del endpoint de la imagen (ej. /api/v1/conductores/ID/qr).
 * @param token Token de autenticación (opcional).
 * @returns Una promesa que resuelve con la URL del Blob de la imagen.
 */
export async function fetchImageApi(url: string, token?: string): Promise<APIResponse<string>> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      // Si la respuesta no es OK, intenta leer como texto para ver si hay un mensaje de error
      const errorText = await response.text();
      return { success: false, data: undefined, message: errorText || `Error al obtener imagen (Código: ${response.status}).`, status: response.status };
    }

    // Leemos la respuesta como un Blob (el tipo binario de la imagen)
    const imageBlob = await response.blob();
    // Creamos una URL de objeto para el Blob, que puede ser usada en <img>
    const imageUrl = URL.createObjectURL(imageBlob);

    return { success: true, data: imageUrl, message: 'Imagen obtenida exitosamente.', status: response.status };

  } catch (error: any) {
    console.error(`Error fetching image from ${url}:`, error);
    return { success: false, data: undefined, message: error.message || 'Error de red o servidor al obtener imagen.', status: 500 };
  }
}


/**
 * Función genérica para realizar peticiones POST a la API que esperan JSON en el cuerpo.
 * @param url La URL completa del endpoint.
 * @param body El cuerpo de la petición (objeto JSON).
 * @param token Token de autenticación (opcional).
 * @returns Una promesa que resuelve con los datos de la API.
 */
export async function postApi<T>(
  url: string,
  body: any,
  token?: string
): Promise<APIResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json(); // Aquí SÍ esperamos JSON para POST

    if (!response.ok) {
      return { success: false, data: undefined, message: data.message || 'Error al enviar datos.', status: response.status };
    }

    return { success: true, data: data, message: 'Datos enviados exitosamente.', status: response.status };
  } catch (error: any) {
    console.error(`Error posting to ${url}:`, error);
    return { success: false, data: undefined, message: error.message || 'Error de red o servidor.', status: 500 };
  }
}

/**
 * Función genérica para realizar peticiones PUT a la API que esperan JSON en el cuerpo.
 * @param url La URL completa del endpoint.
 * @param body El cuerpo de la petición (objeto JSON).
 * @param token Token de autenticación (opcional).
 * @returns Una promesa que resuelve con los datos de la API.
 */
export async function putApi<T>(
  url: string,
  body: any,
  token?: string
): Promise<APIResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, data: undefined, message: data.message || 'Error al actualizar datos.', status: response.status };
    }

    return { success: true, data: data, message: 'Datos actualizados exitosamente.', status: response.status };
  } catch (error: any) {
    console.error(`Error putting to ${url}:`, error);
    return { success: false, data: undefined, message: error.message || 'Error de red o servidor.', status: 500 };
  }
}

/**
 * Función genérica para realizar peticiones DELETE a la API.
 * @param url La URL completa del endpoint.
 * @param token Token de autenticación (opcional).
 * @returns Una promesa que resuelve con los datos de la API.
 */
export async function deleteApi<T>(
  url: string,
  token?: string
): Promise<APIResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    // Las respuestas 204 No Content no tienen body.
    // Intentar parsear JSON solo si el status no es 204.
    if (response.status === 204) {
      return { success: true, data: undefined, message: 'Recurso eliminado exitosamente.', status: response.status };
    }
    const data = await response.json();

    if (!response.ok) {
      return { success: false, data: undefined, message: data.message || 'Error al eliminar.', status: response.status };
    }

    return { success: true, data: data, message: 'Recurso eliminado exitosamente.', status: response.status };
  } catch (error: any) {
    console.error(`Error deleting from ${url}:`, error);
    return { success: false, data: undefined, message: error.message || 'Error de red o servidor.', status: 500 };
  }
}

/**
 * Función específica para peticiones de archivos (multipart/form-data).
 * @param url La URL completa del endpoint.
 * @param formData FormData que contiene los archivos y otros campos.
 * @param token Token de autenticación (opcional).
 * @returns Una promesa que resuelve con los datos de la API (generalmente JSON).
 */
export async function uploadFileApi<T>(
  url: string,
  formData: FormData, // Usamos FormData para subir archivos
  token?: string
): Promise<APIResponse<T>> {
  const headers: HeadersInit = {}; // No Content-Type aquí, fetch lo establece automáticamente para FormData
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData, // Pasa directamente el FormData
    });
    const data = await response.json(); // Se espera JSON como respuesta

    if (!response.ok) {
      return { success: false, data: undefined, message: data.message || 'Error al subir archivo.', status: response.status };
    }

    return { success: true, data: data, message: 'Archivo subido exitosamente.', status: response.status };
  } catch (error: any) {
    console.error(`Error uploading file to ${url}:`, error);
    return { success: false, data: undefined, message: error.message || 'Error de red o servidor al subir archivo.', status: 500 };
  }
}