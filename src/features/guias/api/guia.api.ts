import { coreApi } from '@/services/coreApi';
import type {
  Guia,
  Sesion,
  CreateSesionPayload,
  GenerateGuiaPayload,
  UpdateGuiaPayload,
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

  getMisGuias: async (): Promise<Guia[]> => {
    const { data } = await coreApi.get<Guia[]>('/guias/mis-guias');
    return data;
  },

  /**
   * Workaround: el core no tiene GET /guias/:id todavía.
   * Carga la lista del docente y busca por id.
   * Reemplazar con `coreApi.get<Guia>(\`/guias/\${id}\`)` cuando esté disponible.
   */
  getGuia: async (id: number): Promise<Guia> => {
    const { data } = await coreApi.get<Guia[]>('/guias/mis-guias');
    const found = data.find((g) => g.id === id);
    if (!found) throw new Error('Guía no encontrada');
    return found;
  },
};
