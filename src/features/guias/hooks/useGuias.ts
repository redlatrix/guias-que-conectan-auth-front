import { useState, useCallback } from 'react';
import { guiaService } from '../api/guia.api';
import type {
  Guia,
  CreateSesionPayload,
  GenerateGuiaPayload,
  UpdateGuiaPayload,
} from '../types/guia.types';

export interface UseGuiasReturn {
  guias: Guia[];
  currentGuia: Guia | null;
  isGenerating: boolean;
  isSaving: boolean;
  isLoadingList: boolean;
  error: string | null;
  generateGuia: (
    sesionPayload: CreateSesionPayload,
    guiaPayload: Omit<GenerateGuiaPayload, 'sesion_id'>
  ) => Promise<void>;
  saveGuia: (id: number, payload: UpdateGuiaPayload) => Promise<void>;
  setCurrentGuia: (guia: Guia | null) => void;
  loadMisGuias: () => Promise<void>;
  loadGuia: (id: number) => Promise<void>;
  resetGuia: () => void;
}

export const useGuias = (): UseGuiasReturn => {
  const [guias, setGuias] = useState<Guia[]>([]);
  const [currentGuia, setCurrentGuia] = useState<Guia | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateGuia = useCallback(
    async (
      sesionPayload: CreateSesionPayload,
      guiaPayload: Omit<GenerateGuiaPayload, 'sesion_id'>
    ) => {
      setIsGenerating(true);
      setError(null);
      try {
        const sesion = await guiaService.createSesion(sesionPayload);
        const guia = await guiaService.generateGuia({
          sesion_id: sesion.id,
          ...guiaPayload,
        });
        setCurrentGuia(guia);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { error?: string } } };
        const msg = e.response?.data?.error ?? 'Error al generar la guía';
        setError(msg);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const saveGuia = useCallback(async (id: number, payload: UpdateGuiaPayload) => {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await guiaService.updateGuia(id, payload);
      setCurrentGuia(updated);
      setGuias((prev) => prev.map((g) => (g.id === id ? updated : g)));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      const msg = e.response?.data?.error ?? 'Error al guardar la guía';
      setError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const loadMisGuias = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const data = await guiaService.getMisGuias();
      setGuias(data);
    } catch {
      setError('Error al cargar tus guías');
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  const loadGuia = useCallback(async (id: number) => {
    setIsLoadingList(true);
    setError(null);
    try {
      const guia = await guiaService.getGuia(id);
      setCurrentGuia(guia);
    } catch {
      setError('Guía no encontrada');
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  const resetGuia = useCallback(() => {
    setCurrentGuia(null);
    setError(null);
  }, []);

  return {
    guias,
    currentGuia,
    isGenerating,
    isSaving,
    isLoadingList,
    error,
    generateGuia,
    saveGuia,
    setCurrentGuia,
    loadMisGuias,
    loadGuia,
    resetGuia,
  };
};
