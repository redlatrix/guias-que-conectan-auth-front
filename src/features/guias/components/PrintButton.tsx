import type { RefObject } from 'react';
import { PiFilePdfBold } from 'react-icons/pi';

interface PrintButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
  documentTitle?: string;
}

/**
 * Abre la actividad del estudiante en una nueva pestaña con un botón
 * "Imprimir / Guardar PDF". Usa window.open + innerHTML para preservar
 * todos los estilos inline de ActividadImprimible sin iframes en la misma página.
 */
export const PrintButton = ({ contentRef, documentTitle = 'Actividad Imprimible' }: PrintButtonProps) => {
  const handleOpen = () => {
    const element = contentRef.current;
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('El navegador bloqueó la apertura de la nueva pestaña. Permite ventanas emergentes para este sitio.');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: 'Public Sans', Arial, sans-serif;
      color: #1a1a1a;
      background: #f5f5ef;
      margin: 0;
      padding: 24px 16px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      body { background: #fff; padding: 0; }
    }
    @page { size: A4; margin: 1.5cm; }
    @media print {
      body { padding: 0; }
      .print-block { page-break-inside: avoid; break-inside: avoid; }
    }
    table { border-collapse: collapse; width: 100%; }
    th, td { padding: 8px 10px; }
    img { max-width: 100%; height: auto; }
    h1, h2, h3 { font-family: 'Crimson Pro', Georgia, serif; }
    .print-block { page-break-inside: avoid; break-inside: avoid; }
  </style>
</head>
<body>
  ${element.outerHTML}
  <script>window.addEventListener('load', function() { window.print(); });</script>
</body>
</html>`);

    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-600 border-red-600 border-2 font-public font-semibold px-5 py-2.5 rounded-lg transition"
      title="Abrir actividad del estudiante en nueva pestaña"
    >
      <PiFilePdfBold className="text-red-600 text-2xl" />
      Actividad PDF
    </button>
  );
};
