import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCatalogo } from '../hooks/useCatalogo';
import { useGuias } from '../hooks/useGuias';
import { SkeletonGuia } from './SkeletonGuia';
import { GuiaEditor } from './GuiaEditor';
import { DbaDropdown } from './DbaDropdown';
import type { Step1FormData, Step2FormData, BloqueContenido } from '../types/guia.types';

const selectClass =
  'w-full border border-gray-300 rounded-lg px-4 py-3 text-base font-public bg-white outline-none focus:border-copper focus:ring-1 focus:ring-copper transition disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed';

const labelClass = 'block text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1.5 font-public';

const inputClass =
  'w-full border border-gray-300 rounded-lg px-4 py-3 text-base font-public bg-white outline-none focus:border-copper focus:ring-1 focus:ring-copper transition';

export const GeneradorGuia = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);

  const catalogo = useCatalogo();
  const { currentGuia, isGenerating, isSaving, isPublishing, error, generateGuia, saveGuia, publishGuia, resetGuia } =
    useGuias();

  // Formularios independientes por paso
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    watch: watch1,
    formState: { errors: errors1 },
  } = useForm<Step1FormData>();

  const dbaIdActual = watch1('dba_id');

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm<Step2FormData>();

  // ── Paso 1: selección de catálogo ─────────────────────────────────────────
  const onStep1Submit = (data: Step1FormData) => {
    setStep1Data(data);
    setStep(2);
  };

  // ── Paso 2: prompt y parámetros → generar ─────────────────────────────────
  const onStep2Submit = async (data: Step2FormData) => {
    if (!step1Data) return;
    const numEstudiantes = data.numero_estudiantes;
    await generateGuia(
      {
        dba_catalogo_id: step1Data.dba_id,
        competencia_id:  step1Data.competencia_id ?? null,
      },
      {
        prompt_docente: data.prompt_docente,
        numero_estudiantes: numEstudiantes && !isNaN(numEstudiantes) ? numEstudiantes : undefined,
        duracion_sesion: data.duracion_sesion || undefined,
      }
    );
  };

  // ── Guardar desde el editor ────────────────────────────────────────────────
  const handleSave = async (titulo: string, contenido_json: BloqueContenido[]) => {
    if (!currentGuia) return;
    await saveGuia(currentGuia.id, { titulo, contenido_json });
  };

  // ── Empezar de nuevo ───────────────────────────────────────────────────────
  const handleNuevaGuia = () => {
    resetGuia();
    setStep(1);
    setStep1Data(null);
  };

  // ── Estado: guía generada → mostrar editor ─────────────────────────────────
  if (currentGuia) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-crimson text-2xl font-bold text-olive">Guía generada</h2>
            <p className="text-sm text-gray-400 font-public">
              Puedes editar cada bloque y guardar los cambios.
            </p>
          </div>
          <button
            onClick={handleNuevaGuia}
            className="text-sm text-copper hover:text-copper-dark font-public font-semibold border border-copper/40 hover:border-copper px-4 py-2 rounded-lg transition"
          >
            + Nueva guía
          </button>
        </div>
        <GuiaEditor
          guia={currentGuia}
          isSaving={isSaving}
          isPublishing={isPublishing}
          onSave={handleSave}
          onPublish={() => publishGuia(currentGuia.id)}
        />
      </div>
    );
  }

  // ── Estado: generando ──────────────────────────────────────────────────────
  if (isGenerating) {
    return <SkeletonGuia />;
  }

  // ── Formulario ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl lg:max-w-4xl mx-auto">
      {/* Título del flujo */}
      <div className="mb-8">
        <h2 className="font-crimson text-3xl font-bold text-olive mb-1">Crear nueva guía</h2>
        <p className="text-sm text-gray-500 font-public">
          Completa los datos para que la IA genere una guía pedagógica estructurada.
        </p>
      </div>

      {/* Stepper visual */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { n: 1, label: 'Selección pedagógica' },
          { n: 2, label: 'Descripción y parámetros' },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-public transition-colors ${
                  step === n
                    ? 'bg-copper text-white'
                    : step > n
                    ? 'bg-olive text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step > n ? '✓' : n}
              </div>
              <span
                className={`text-xs font-public hidden sm:block ${
                  step === n ? 'text-copper font-semibold' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div className={`flex-1 h-0.5 ${step > n ? 'bg-olive' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── PASO 1 ── */}
      {step === 1 && (
        <form
          onSubmit={handleSubmit1(onStep1Submit)}
          className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-olive space-y-5"
        >
          <h3 className="font-crimson text-xl font-bold text-olive">
            Selección pedagógica
          </h3>
          <p className="text-xs text-gray-400 font-public -mt-2">
            Elige el grado, la competencia y el DBA que orientará la guía.
          </p>

          {/* Grado */}
          <div>
            <label className={labelClass}>Grado</label>
            <select
              {...register1('grado_id', { required: 'Selecciona un grado', valueAsNumber: true })}
              disabled={catalogo.loadingGrados}
              onChange={(e) => {
                const id = Number(e.target.value);
                setValue1('grado_id', id);
                setValue1('dba_id', 0);
                const grado = catalogo.grados.find((g) => g.id === id) ?? null;
                catalogo.selectGrado(grado);
              }}
              className={selectClass}
              defaultValue=""
            >
              <option value="" disabled>
                {catalogo.loadingGrados ? 'Cargando grados...' : 'Selecciona un grado'}
              </option>
              {catalogo.grados.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre}
                </option>
              ))}
            </select>
            {errors1.grado_id && (
              <p className="text-xs text-red-500 mt-1 font-public">{errors1.grado_id.message}</p>
            )}
          </div>

          {/* Competencia — metadato independiente, no bloquea carga de DBAs */}
          <div>
            <label className={labelClass}>
              Competencia <span className="text-gray-400 font-normal normal-case tracking-normal">(opcional — contexto para la IA)</span>
            </label>
            <select
              {...register1('competencia_id', { valueAsNumber: true })}
              disabled={!catalogo.selectedGrado || catalogo.loadingCompetencias}
              onChange={(e) => {
                const id = Number(e.target.value);
                setValue1('competencia_id', id || undefined);
              }}
              className={selectClass}
              defaultValue=""
            >
              <option value="">
                {!catalogo.selectedGrado
                  ? 'Primero selecciona un grado'
                  : catalogo.loadingCompetencias
                  ? 'Cargando competencias...'
                  : 'Sin competencia específica'}
              </option>
              {catalogo.competencias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* DBA — custom dropdown con enunciado completo */}
          <div>
            <label className={labelClass}>Derecho Básico de Aprendizaje (DBA) <span className="text-red-400">*</span></label>
            {/* Campo oculto para react-hook-form */}
            <input type="hidden" {...register1('dba_id', { required: 'Selecciona un DBA', valueAsNumber: true })} />
            <DbaDropdown
              dbas={catalogo.dbas}
              value={dbaIdActual || 0}
              onChange={(id) => setValue1('dba_id', id, { shouldValidate: true })}
              loading={catalogo.loadingDBAs}
              disabled={!catalogo.selectedGrado}
              placeholder={
                !catalogo.selectedGrado
                  ? 'Primero selecciona un grado'
                  : catalogo.loadingDBAs
                  ? 'Cargando DBAs...'
                  : 'Selecciona un DBA'
              }
            />
            {errors1.dba_id && (
              <p className="text-xs text-red-500 mt-1 font-public">{errors1.dba_id.message}</p>
            )}
          </div>

          {/* Error global */}
          {catalogo.error && (
            <p className="text-xs text-red-500 font-public bg-red-50 rounded-md px-3 py-2">
              {catalogo.error}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-olive hover:bg-olive-dark text-white font-public font-semibold px-6 py-2.5 rounded-lg transition"
            >
              Siguiente →
            </button>
          </div>
        </form>
      )}

      {/* ── PASO 2 ── */}
      {step === 2 && (
        <form
          onSubmit={handleSubmit2(onStep2Submit)}
          className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-copper space-y-5"
        >
          <h3 className="font-crimson text-xl font-bold text-olive">
            Descripción y parámetros
          </h3>
          <p className="text-xs text-gray-400 font-public -mt-2">
            Cuéntale a la IA qué quieres que los estudiantes aprendan y cómo.
          </p>

          {/* Prompt del docente */}
          <div>
            <label className={labelClass}>
              Solicitud al asistente IA <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register2('prompt_docente', {
                required: 'Describe qué quieres que aprendan tus estudiantes',
                minLength: {
                  value: 20,
                  message: 'Describe con más detalle (mínimo 20 caracteres)',
                },
              })}
              rows={5}
              placeholder="Ej: Quiero que mis estudiantes comprendan cómo se formaron los grupos indígenas en Colombia, sus territorios y costumbres principales. Que incluya una actividad de mapa conceptual grupal."
              className={`${inputClass} resize-y`}
            />
            {errors2.prompt_docente && (
              <p className="text-xs text-red-500 mt-1 font-public">
                {errors2.prompt_docente.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Número de estudiantes */}
            <div>
              <label className={labelClass}>Número de estudiantes</label>
              <input
                type="number"
                min={1}
                max={100}
                placeholder="30"
                {...register2('numero_estudiantes', {
                  valueAsNumber: true,
                  min: { value: 1, message: 'Mínimo 1 estudiante' },
                  max: { value: 100, message: 'Máximo 100 estudiantes' },
                })}
                className={inputClass}
              />
              {errors2.numero_estudiantes && (
                <p className="text-xs text-red-500 mt-1 font-public">
                  {errors2.numero_estudiantes.message}
                </p>
              )}
            </div>

            {/* Duración de la sesión */}
            <div>
              <label className={labelClass}>Duración de la sesión</label>
              <input
                type="text"
                placeholder="Ej: 2 horas, 90 minutos"
                {...register2('duracion_sesion')}
                className={inputClass}
              />
            </div>
          </div>

          {/* Error de generación */}
          {error && (
            <p className="text-xs text-red-500 font-public bg-red-50 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {/* Botones */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-700 font-public transition"
            >
              ← Volver
            </button>
            <button
              type="submit"
              className="bg-copper hover:bg-copper-dark text-white font-public font-semibold px-6 py-2.5 rounded-lg transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generar con IA
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
