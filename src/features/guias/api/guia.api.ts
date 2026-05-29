import { coreApi } from '@/services/coreApi';
import type {
  Guia,
  Sesion,
  CreateSesionPayload,
  GenerateGuiaPayload,
  UpdateGuiaPayload,
  PaginatedResponse,
} from '../types/guia.types';

export const guiaService = {
  createSesion: async (payload: CreateSesionPayload): Promise<Sesion> => {
    const { data } = await coreApi.post<Sesion>('/sesiones', payload);
    return data;
  },

  generateGuia: async (payload: GenerateGuiaPayload): Promise<Guia> => {
    const { data } = await coreApi.post<Guia>('/guias/generate', payload);
    return data;
  },

  updateGuia: async (id: number, payload: UpdateGuiaPayload): Promise<Guia> => {
    const { data } = await coreApi.put<Guia>(`/guias/${id}`, payload);
    return data;
  },

  getMisGuias: async (page = 1, limit = 6): Promise<PaginatedResponse<Guia>> => {
    const { data } = await coreApi.get<PaginatedResponse<Guia>>('/guias/mis-guias', {
      params: { page, limit },
    });
    return data;
  },

  getGuia: async (id: number): Promise<Guia> => {
    const { data } = await coreApi.get<PaginatedResponse<Guia>>('/guias/mis-guias');
    const found = data.data.find((g) => g.id === id);
    if (!found) throw new Error('Guía no encontrada');
    return found;
  },

  publishGuia: async (id: number): Promise<Guia> => {
    const { data } = await coreApi.post<{ guia: Guia }>(`/guias/${id}/publish`);
    return data.guia;
  },

  regenerarImagen: async (id: number, prompt: string): Promise<{ url: string }> => {
    const { data } = await coreApi.post<{ url: string }>(`/guias/${id}/regenerar-imagen`, { prompt });
    return data;
  },

  getGuiasPublicas: async (page = 1, limit = 6): Promise<PaginatedResponse<Guia>> => {
    const { data } = await coreApi.get<PaginatedResponse<Guia>>('/guias/publicas', {
      params: { page, limit },
    });
    return data;
  },

  getGuiaPublica: async (id: number): Promise<Guia> => {
    const { data } = await coreApi.get<Guia>(`/guias/publicas/${id}`);
    return data;
  },
};
