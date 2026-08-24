export function EstadoDeudaPrintStyles() {
  return (
    <style>{`
      @media print {
        body * { visibility: hidden !important; }
        #estado-deuda-print, #estado-deuda-print * { visibility: visible !important; }
        #estado-deuda-print {
          position: absolute !important;
          inset: 0 auto auto 0 !important;
          width: 100% !important;
          min-height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        #estado-deuda-print thead { display: table-header-group; }
        #estado-deuda-print tr { break-inside: avoid; page-break-inside: avoid; }
        .no-print { display: none !important; }
        @page { size: A4 portrait; margin: 15mm; }
      }
    `}</style>
  );
}
