export interface Grado {
  id: number;
  nombre: string;
  numero: number;
  area: string;
}

export interface Competencia {
  id: number;
  nombre: string;
  tipo_cs: string;
  descripcion: string;
  area: string;
}

export interface DBA {
  id: number;
  codigo_men: string;
  enunciado_oficial: string;
  evidencias_aprendizaje: string;
}

export type TipoBloque = 'texto' | 'imagen' | 'actividad' | 'cuestionario';

export interface BloqueContenido {
  tipo: TipoBloque;
  contenido: string; // Markdown
  metadata: Record<string, unknown>;
}

export interface MetadataImagen {
  alt: string;
  url: string;
  prompt?: string;
}

export interface MetadataActividad {
  duracion_min: number;
  tipo: 'individual' | 'grupal' | 'parejas';
}

export interface Sesion {
  id: number;
  docente_id: number;
  dba_catalogo_id: number;
  modelo_ia: string;
  estado: 'activa' | 'completada' | 'cancelada';
  prompt_sistema: string;
  creado_en: string;
}

export type EstadoGuia = 'borrador' | 'publicado';

export interface Guia {
  id: number;
  sesion_id: number;
  dba_catalogo_id: number;
  titulo: string;
  version_numero: number;
  estado: EstadoGuia;
  es_version_activa: boolean;
  contenido_json: BloqueContenido[];
  creado_en: string;
  actualizado_en?: string;
  docente_nombre?: string;
  grado_nombre?: string;
  grado_numero?: number;
  area?: string;
}

export interface CreateSesionPayload {
  dba_catalogo_id: number;
  competencia_id?: number | null;
  modelo_ia?: string;
}

export interface GenerateGuiaPayload {
  sesion_id: number;
  prompt_docente: string;
  numero_estudiantes?: number;
  duracion_sesion?: string;
}

export interface UpdateGuiaPayload {
  titulo?: string;
  contenido_json?: BloqueContenido[];
}


export interface Step1FormData {
  grado_id: number;
  competencia_id?: number;
  dba_id: number;
}

export interface Step2FormData {
  prompt_docente: string;
  numero_estudiantes?: number;
  duracion_sesion?: string;
}

export interface ActividadImprimibleProps {
  allBlocks: BloqueContenido[];
  titulo: string;
}