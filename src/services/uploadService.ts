// src/services/uploadService.ts
import { buildApiUrl } from '../config/api.unified.config';
import { NotificationService } from '../components/utils/Notification';
import apiClient from './apiClient';

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    filename?: string;
    url?: string;
    path?: string;
    size?: number;
    mimetype?: string;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class UploadService {
  private static instance: UploadService;
  private endpoint: string;
  
  private constructor() {
    this.endpoint = '/api/upload';
  }
  
  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }
  
  /**
   * Sube un archivo al servidor
   * Requiere autenticación Bearer.
   */
  async uploadFile(
    file: File, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      console.log('📤 [UploadService] Subiendo archivo:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Construir URL completa
      const url = buildApiUrl(this.endpoint);
      console.log('🌐 [UploadService] URL de upload:', url);
      
      // Crear XMLHttpRequest para manejar progreso
      if (onProgress) {
        return await this.uploadWithProgress(url, formData, onProgress);
      }
      
      // Upload simple sin progreso
      const rawResponse = await apiClient.request<UploadResponse | string>(url, {
        method: 'POST',
        body: formData
        // NO incluir headers, el navegador los configura automáticamente para FormData
      });
      
      const responseData: UploadResponse = typeof rawResponse === 'string'
        ? {
          success: true,
          message: rawResponse || 'Archivo subido exitosamente',
          data: {
            filename: file.name
          }
        }
        : rawResponse;
      
      if (responseData.success !== false) {
        NotificationService.success(`Archivo ${file.name} subido exitosamente`);
      }
      
      return responseData;
      
    } catch (error: any) {
      console.error('❌ [UploadService] Error al subir archivo:', error);
      NotificationService.error(error.message || 'Error al subir el archivo');
      throw error;
    }
  }
  
  /**
   * Sube múltiples archivos
   */
  async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResponse[]> {
    try {
      console.log(`📤 [UploadService] Subiendo ${files.length} archivos`);
      
      const results: UploadResponse[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📤 [UploadService] Subiendo archivo ${i + 1}/${files.length}: ${file.name}`);
        
        const result = await this.uploadFile(
          file,
          onProgress ? (progress) => onProgress(i, progress) : undefined
        );
        
        results.push(result);
      }
      
      console.log(`✅ [UploadService] Todos los archivos subidos`);
      return results;
      
    } catch (error: any) {
      console.error('❌ [UploadService] Error al subir múltiples archivos:', error);
      throw error;
    }
  }
  
  /**
   * Upload con seguimiento de progreso usando XMLHttpRequest
   */
  private uploadWithProgress(
    url: string, 
    formData: FormData, 
    onProgress: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Configurar listeners
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            // Verificar el content-type de la respuesta
            const contentType = xhr.getResponseHeader('content-type');
            let response;
            
            if (contentType && contentType.includes('application/json')) {
              response = JSON.parse(xhr.responseText);
            } else {
              // Si no es JSON, crear una respuesta de éxito genérica
              response = {
                success: true,
                message: xhr.responseText || 'Archivo subido exitosamente',
                data: {
                  filename: 'uploaded'
                }
              };
            }
            resolve(response);
          } catch {
            // Si hay error al parsear, devolver respuesta de éxito genérica
            resolve({
              success: true,
              message: 'Archivo subido exitosamente',
              data: {}
            });
          }
        } else {
          reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Error de red al subir el archivo'));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelado'));
      });
      
      // Abrir y enviar request
      xhr.open('POST', url);
      xhr.send(formData);
    });
  }
  
  /**
   * Valida si un archivo es válido para subir
   */
  validateFile(
    file: File, 
    options?: {
      maxSize?: number; // En bytes
      allowedTypes?: string[]; // MIME types
    }
  ): { valid: boolean; error?: string } {
    const { maxSize = 10 * 1024 * 1024, allowedTypes } = options || {}; // 10MB por defecto
    
    // Validar tamaño
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `El archivo excede el tamaño máximo permitido (${Math.round(maxSize / 1024 / 1024)}MB)`
      };
    }
    
    // Validar tipo
    if (allowedTypes && allowedTypes.length > 0) {
      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
        };
      }
    }
    
    return { valid: true };
  }
  
  /**
   * Valida si es una imagen
   */
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }
  
  /**
   * Obtiene la URL de preview para una imagen
   */
  getImagePreviewUrl(file: File): string {
    if (!this.isImage(file)) {
      throw new Error('El archivo no es una imagen');
    }
    return URL.createObjectURL(file);
  }
  
  /**
   * Libera la URL de preview
   */
  releaseImagePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

// Exportar la instancia singleton
const uploadService = UploadService.getInstance();
export default uploadService;

// También exportar la clase para tests
export { UploadService };
