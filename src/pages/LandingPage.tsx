import { Link } from 'react-router-dom';
import { GlobeIcon } from '@/features/auth/components/GlobeIcon';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);


const PublicNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-olive px-6 py-3 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-2.5">
      <GlobeIcon size={28} />
      <div>
        <p className="text-cream font-crimson font-bold text-sm tracking-widest uppercase leading-none">
          Guias que
        </p>
        <p className="text-cream/70 text-[9px] tracking-[0.3em] uppercase font-public">
          Conectan
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Link
        to="/explorar"
        className="text-cream/80 hover:text-cream text-sm font-public transition"
      >
        Explorar guías
      </Link>
      <Link
        to="/login"
        className="text-cream text-sm font-public font-semibold bg-copper hover:bg-copper-dark px-4 py-1.5 rounded-md transition"
      >
        Iniciar Sesión
      </Link>
    </div>
  </nav>
);


const Step = ({ n, titulo, desc }: { n: number; titulo: string; desc: string }) => (
  <div className="flex flex-col items-center text-center gap-4 flex-1 min-w-[200px]">
    <div className="w-12 h-12 rounded-full bg-olive text-cream flex items-center justify-center font-crimson font-bold text-xl shadow-md">
      {n}
    </div>
    <div>
      <h3 className="font-crimson text-lg font-bold text-olive mb-1">{titulo}</h3>
      <p className="text-sm text-gray-500 font-public leading-relaxed">{desc}</p>
    </div>
  </div>
);


export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-cream font-public">
      <PublicNavbar />

      <section className="bg-olive pt-28 pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <GlobeIcon size={72} />
          </div>
          <h1 className="font-crimson text-5xl sm:text-6xl font-bold text-cream leading-tight mb-4">
            Guías que Conectan
          </h1>
          <p className="text-cream/75 font-public text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Genera guías pedagógicas alineadas con los Derechos Básicos de Aprendizaje del MEN
            usando Inteligencia Artificial — en minutos, listas para usar en el aula.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="font-public font-semibold px-7 py-3 rounded-lg border-2 border-cream/50 text-cream hover:bg-cream/10 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/explorar"
              className="font-public font-semibold px-7 py-3 rounded-lg bg-copper hover:bg-copper-dark text-cream transition flex items-center gap-2"
            >
              Explorar guías <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>


      <section className="bg-cream py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-copper font-semibold mb-3 font-public">
              La plataforma
            </p>
            <h2 className="font-crimson text-3xl sm:text-4xl font-bold text-olive leading-tight mb-5">
              ¿Qué es Guías que Conectan?
            </h2>
            <p className="text-gray-600 font-public leading-relaxed mb-4">
              Es una herramienta digital diseñada para docentes colombianos de Ciencias Sociales
              que automatiza la creación de guías de aprendizaje estructuradas, alineadas con los
              estándares curriculares del Ministerio de Educación Nacional (MEN).
            </p>
            <p className="text-gray-600 font-public leading-relaxed">
              Gracias a modelos de lenguaje e imagen de última generación, cada guía se genera
              con propósitos claros, actividades graduadas, imagen ilustrativa y una
              <strong className="text-olive"> hoja de trabajo imprimible</strong> para el estudiante.
            </p>
          </div>
          {/* Características */}
          <div className="flex flex-col gap-4">
            {[
              { icon: '🤖', label: 'Generada con IA', desc: 'GPT-4o-mini + DALL·E 3 crean el contenido y la imagen ilustrativa.' },
              { icon: '📚', label: 'Alineada con DBA MEN', desc: 'Cada guía parte de un DBA oficial seleccionado por el docente.' },
              { icon: '🖨️', label: 'Lista para imprimir', desc: 'Incluye hoja de trabajo para el estudiante, exportable en PDF.' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="bg-white rounded-xl p-4 flex items-start gap-4 shadow-sm border border-gray-100">
                <span className="text-2xl mt-0.5">{icon}</span>
                <div>
                  <p className="font-public font-semibold text-olive text-sm">{label}</p>
                  <p className="font-public text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-copper font-semibold mb-3 font-public text-center">
            Estándares MEN
          </p>
          <h2 className="font-crimson text-3xl sm:text-4xl font-bold text-olive text-center leading-tight mb-8">
            ¿Qué son los DBA?
          </h2>
          <p className="text-gray-600 font-public leading-relaxed mb-6 text-center">
            Los <strong className="text-olive">Derechos Básicos de Aprendizaje (DBA)</strong> son
            los saberes y habilidades fundamentales que todos los estudiantes colombianos deben
            desarrollar al finalizar cada grado escolar, según los lineamientos del MEN.
            Funcionan como referentes mínimos para planear, desarrollar y evaluar el proceso educativo.
          </p>

          <div className="border-l-4 border-copper bg-copper/5 rounded-r-xl px-6 py-5 mb-8">
            <p className="text-sm text-gray-500 font-public italic mb-2">
              Ejemplo de DBA — Grado 11° · Ciencias Sociales
            </p>
            <p className="font-crimson text-lg text-olive font-semibold leading-snug">
              "Comprende las dinámicas políticas de la geopolítica actual y las relaciones
              de Colombia con las potencias emergentes."
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-600 font-public">
            {[
              'Establecidos para cada grado escolar',
              'Cubren todas las áreas curriculares',
              'Base para la planeación de clase',
            ].map((txt) => (
              <div key={txt} className="flex items-center gap-2 bg-cream rounded-lg px-4 py-3 flex-1">
                <CheckIcon />
                <span>{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-copper font-semibold mb-3 font-public text-center">
            Proceso
          </p>
          <h2 className="font-crimson text-3xl sm:text-4xl font-bold text-olive text-center leading-tight mb-12">
            Cómo funciona la plataforma
          </h2>
          <div className="flex flex-col sm:flex-row items-start gap-8 relative">
            {/* Línea conectora (solo escritorio) */}
            <div className="hidden sm:block absolute top-6 left-[16.66%] right-[16.66%] h-0.5 bg-olive/20" />
            <Step
              n={1}
              titulo="Selecciona un DBA"
              desc="Elige el grado, la competencia y el Derecho Básico de Aprendizaje que orientará tu clase."
            />
            <Step
              n={2}
              titulo="Describe tu clase"
              desc="Cuéntale a la IA el objetivo de la sesión, el número de estudiantes y la duración disponible."
            />
            <Step
              n={3}
              titulo="Obtén tu guía"
              desc="En segundos recibes la guía completa con actividades, imagen pedagógica y hoja de trabajo imprimible."
            />
          </div>
        </div>
      </section>


      <section className="bg-olive py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-crimson text-3xl sm:text-4xl font-bold text-cream mb-4">
            Empieza a crear guías hoy
          </h2>
          <p className="text-cream/70 font-public mb-8 leading-relaxed">
            Únete a los docentes colombianos que ya usan la IA para diseñar clases
            alineadas con los estándares del MEN.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="font-public font-semibold px-7 py-3 rounded-lg bg-copper hover:bg-copper-dark text-cream transition"
            >
              Registrarse gratis
            </Link>
            <Link
              to="/explorar"
              className="font-public font-semibold px-7 py-3 rounded-lg border-2 border-cream/40 text-cream hover:bg-cream/10 transition flex items-center gap-2"
            >
              Ver guías publicadas <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-olive-dark py-6 px-6 text-center">
        <p className="text-cream/40 text-xs font-public">
          © 2026 Guías que Conectan · Plataforma educativa alineada con los DBA del MEN Colombia
        </p>
      </footer>
    </div>
  );
};
