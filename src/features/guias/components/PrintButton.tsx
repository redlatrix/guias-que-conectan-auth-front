import type { RefObject } from 'react';
import { useState } from 'react';
import { PiFilePdfBold } from 'react-icons/pi';

interface PrintButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
  documentTitle?: string;
  label?: string;
}

export const PrintButton = ({
  contentRef,
  documentTitle = 'Actividad Imprimible',
  label = 'Actividad PDF',
}: PrintButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const element = contentRef.current;
    if (!element) return;

    setIsGenerating(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { toPng }          = await import('html-to-image');

      const A4_WIDTH = 794;

      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, {
        position:      'absolute',
        top:           '0',
        left:          '0',
        width:         `${A4_WIDTH}px`,
        overflow:      'hidden',
        zIndex:        '-9999',
        opacity:       '0',
        pointerEvents: 'none',
      });

      const clone = element.cloneNode(true) as HTMLElement;
      Object.assign(clone.style, {
        width:        `${A4_WIDTH}px`,
        maxWidth:     `${A4_WIDTH}px`,
        height:       'auto',
        margin:       '0',
        padding:      '40px 48px',
        background:   '#ffffff',
        boxShadow:    'none',
        borderRadius: '0',
        overflow:     'visible',
        position:     'static',
      });

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      await new Promise((res) => requestAnimationFrame(() =>
        requestAnimationFrame(() => requestAnimationFrame(res))
      ));

      const captureHeight = clone.scrollHeight;

      wrapper.style.opacity = '1';
      wrapper.style.zIndex  = '99999';
      wrapper.style.top     = `-${captureHeight + 100}px`;

      await new Promise((res) => requestAnimationFrame(res));

      // Lee breakpoints ANTES de capturar (clone en DOM, con layout real)
      const breakPointsImgPx: number[] = [];
      const cloneRect = clone.getBoundingClientRect();
      clone.querySelectorAll('[data-pdf-page-break="true"]').forEach((el) => {
        const rect   = el.getBoundingClientRect();
        const relPx  = rect.top - cloneRect.top; // px relativos al clone
        breakPointsImgPx.push(relPx * 2);        // *2 por scale:2
      });

      const imgData = await toPng(clone, {
        backgroundColor: '#ffffff',
        cacheBust:       true,
        width:           A4_WIDTH,
        height:          captureHeight,
      });

      document.body.removeChild(wrapper);

      const img = new Image();
      img.src = imgData;
      await new Promise((res) => { img.onload = res; });

      const pdf        = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth  = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgTotalH  = (img.height * pageWidth) / img.width;

      // Convierte px de imagen a pt del PDF
      const breakPointsPt = breakPointsImgPx.map(
        (px) => (px / img.height) * imgTotalH
      );

      // Paginación con saltos forzados
      let yOffset = 0;
      let pageNum = 0;

      while (yOffset < imgTotalH - 1) {
        if (pageNum > 0) pdf.addPage();

        // ¿Hay un breakpoint en esta página?
        const forcedBreak = breakPointsPt.find(
          (bp) => bp > yOffset + 10 && bp < yOffset + pageHeight
        );

        const sliceH = forcedBreak
          ? forcedBreak - yOffset  // corta justo antes del breakpoint
          : pageHeight;

        pdf.addImage(imgData, 'PNG', 0, -yOffset, pageWidth, imgTotalH);
        yOffset += sliceH;
        pageNum++;
      }

      const fileName = documentTitle
        .toLowerCase()
        .replace(/[^a-z0-9áéíóúñ\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 60) + '.pdf';

      pdf.save(fileName);

    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('No se pudo generar el PDF. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border-red-600 border-2 font-public font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <svg className="w-5 h-5 animate-spin text-red-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Generando...
        </>
      ) : (
        <>
          <PiFilePdfBold className="text-red-600 text-2xl" />
          {label}
        </>
      )}
    </button>
  );
};