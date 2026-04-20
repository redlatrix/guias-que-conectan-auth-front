import { coreApi } from '@/services/coreApi';
import type { Grado, Competencia, DBA } from '../types/guia.types';

export const catalogoService = {
  getGrados: async (): Promise<Grado[]> => {
    const { data } = await coreApi.get<Grado[]>('/catalogo/grados');
    return data;
  },

  getCompetencias: async (area: string): Promise<Competencia[]> => {
    const { data } = await coreApi.get<Competencia[]>('/catalogo/competencias', {
      params: { area },
    });
    return data;
  },

  getDBAs: async (gradoId: number, competenciaId: number): Promise<DBA[]> => {
    const { data } = await coreApi.get<DBA[]>('/catalogo/dbas', {
      params: { grado_id: gradoId, competencia_id: competenciaId },
    });
    return data;
  },
};
