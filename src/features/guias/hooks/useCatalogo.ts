import { useState, useEffect, useCallback } from 'react';
import { catalogoService } from '../api/catalogo.api';
import type { Grado, Competencia, DBA } from '../types/guia.types';

export interface UseCatalogoReturn {
  grados: Grado[];
  competencias: Competencia[];
  dbas: DBA[];
  selectedGrado: Grado | null;
  selectedCompetencia: Competencia | null;
  loadingGrados: boolean;
  loadingCompetencias: boolean;
  loadingDBAs: boolean;
  error: string | null;
  selectGrado: (grado: Grado | null) => void;
  selectCompetencia: (competencia: Competencia | null) => void;
}

export const useCatalogo = (): UseCatalogoReturn => {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [dbas, setDBAs] = useState<DBA[]>([]);
  const [selectedGrado, setSelectedGrado] = useState<Grado | null>(null);
  const [selectedCompetencia, setSelectedCompetencia] = useState<Competencia | null>(null);
  const [loadingGrados, setLoadingGrados] = useState(false);
  const [loadingCompetencias, setLoadingCompetencias] = useState(false);
  const [loadingDBAs, setLoadingDBAs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingGrados(true);
    catalogoService
      .getGrados()
      .then(setGrados)
      .catch(() => setError('Error al cargar los grados'))
      .finally(() => setLoadingGrados(false));
  }, []);


  useEffect(() => {
    if (!selectedGrado) {
      setCompetencias([]);
      return;
    }
    setLoadingCompetencias(true);
    setCompetencias([]);
    setDBAs([]);
    catalogoService
      .getCompetencias(selectedGrado.area)
      .then(setCompetencias)
      .catch(() => setError('Error al cargar las competencias'))
      .finally(() => setLoadingCompetencias(false));
  }, [selectedGrado]);


  useEffect(() => {
    if (!selectedGrado) {
      setDBAs([]);
      return;
    }
    setLoadingDBAs(true);
    setDBAs([]);
    catalogoService
      .getDBAs(selectedGrado.id)
      .then(setDBAs)
      .catch(() => setError('Error al cargar los DBAs'))
      .finally(() => setLoadingDBAs(false));
  }, [selectedGrado]);

  const selectGrado = useCallback((grado: Grado | null) => {
    setSelectedGrado(grado);
    setSelectedCompetencia(null);
    setDBAs([]);
  }, []);

  const selectCompetencia = useCallback((competencia: Competencia | null) => {
    setSelectedCompetencia(competencia);
    setDBAs([]);
  }, []);

  return {
    grados,
    competencias,
    dbas,
    selectedGrado,
    selectedCompetencia,
    loadingGrados,
    loadingCompetencias,
    loadingDBAs,
    error,
    selectGrado,
    selectCompetencia,
  };
};
