// src/utils/pdfUtils.ts
// @ts-expect-error - missing types for pdfmake library
import * as pdfMakeLib from 'pdfmake/build/pdfmake';

// Obtener pdfMake correctamente según el tipo de export
const pdfMake = (pdfMakeLib as any).default || pdfMakeLib;

// Función para inicializar las fuentes
const initializeFonts = async () => {
  try {
    // @ts-expect-error - missing types for vfs_fonts
    const vfsModule = await import('pdfmake/build/vfs_fonts');
    const vfs = (vfsModule as any).default?.pdfMake?.vfs ||
                (vfsModule as any).pdfMake?.vfs ||
                (vfsModule as any).vfs;

    if (vfs && pdfMake) {
      pdfMake.vfs = vfs;
    }
  } catch (error) {
    console.warn('No se pudieron cargar las fuentes de pdfmake:', error);
  }
};

// Inicializar fuentes inmediatamente
initializeFonts();

// Estilos personalizados para PDFs
export type PDFAlignment = 'left' | 'center' | 'right' | 'justify';

export interface PDFStyle {
  fontSize?: number;
  bold?: boolean;
  italics?: boolean;
  alignment?: PDFAlignment;
  margin?: [number, number, number, number];
  color?: string;
  fillColor?: string;
}

export const pdfStyles: Record<string, PDFStyle> = {
  header: {
    fontSize: 18,
    bold: true,
    alignment: 'center',
    margin: [0, 0, 0, 20],
    color: '#1976d2'
  },
  subheader: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5],
    color: '#424242'
  },
  tableHeader: {
    bold: true,
    fontSize: 11,
    color: 'white',
    fillColor: '#1976d2',
    alignment: 'center',
    margin: [0, 5, 0, 5]
  },
  tableCell: {
    fontSize: 9,
    margin: [0, 3, 0, 3]
  },
  footer: {
    fontSize: 8,
    italics: true,
    color: '#757575',
    alignment: 'center'
  },
  infoLabel: {
    fontSize: 10,
    bold: true,
    color: '#424242'
  },
  infoValue: {
    fontSize: 10,
    color: '#616161'
  },
  title: {
    fontSize: 16,
    bold: true,
    margin: [0, 0, 0, 10],
    color: '#1976d2'
  }
};

// Configuración de márgenes estándar
export const pdfMargins: [number, number, number, number] = [40, 60, 40, 60];

// Interface para contenido de pdfmake (simplificada)
export interface PDFContent {
  text?: string | PDFContent[];
  style?: string;
  alignment?: PDFAlignment;
  margin?: [number, number, number, number];
  columns?: (PDFContent | { text: string; style?: string; width?: string | number })[];
  table?: {
    headerRows?: number;
    widths?: (string | number)[];
    body: PDFContent[][];
  };
  layout?: unknown;
  canvas?: unknown[];
  width?: string | number;
  bold?: boolean;
  color?: string;
}

// Función helper para crear header del PDF
export const createPdfHeader = (title: string, subtitle?: string): PDFContent[] => {
  const header: PDFContent[] = [
    {
      text: 'SISTEMA DE GESTIÓN TRIBUTARIA',
      style: 'header',
      margin: [0, 20, 0, 5]
    },
    {
      text: title,
      style: 'title',
      alignment: 'center'
    }
  ];

  if (subtitle) {
    header.push({
      text: subtitle,
      style: 'subheader',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    });
  }

  return header;
};

// Función helper para crear footer del PDF
export const createPdfFooter = (currentPage: number, pageCount: number) => {
  return {
    columns: [
      {
        text: `Fecha de generación: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}`,
        style: 'footer',
        alignment: 'left' as PDFAlignment
      },
      {
        text: `Página ${currentPage} de ${pageCount}`,
        style: 'footer',
        alignment: 'right' as PDFAlignment
      }
    ],
    margin: [40, 10, 40, 10] as [number, number, number, number]
  };
};

// Función para crear línea divisoria
export const createDivider = () => {
  return {
    canvas: [
      {
        type: 'line',
        x1: 0,
        y1: 0,
        x2: 515,
        y2: 0,
        lineWidth: 1,
        lineColor: '#e0e0e0'
      }
    ],
    margin: [0, 10, 0, 10] as [number, number, number, number]
  };
};

// Función para crear tabla básica
export interface TableColumn {
  header: string;
  dataKey: string;
  width?: string | number;
  alignment?: PDFAlignment;
}

export const createTable = (columns: TableColumn[], data: Record<string, unknown>[]) => {
  const headers = columns.map(col => ({
    text: col.header,
    style: 'tableHeader',
    alignment: col.alignment || 'center'
  }));

  const body = data.map(row =>
    columns.map(col => ({
      text: String(row[col.dataKey] || '-'),
      style: 'tableCell',
      alignment: col.alignment || 'left'
    }))
  );

  const widths = columns.map(col => col.width || '*');

  return {
    table: {
      headerRows: 1,
      widths: widths,
      body: [headers, ...body]
    },
    layout: {
      fillColor: (rowIndex: number) => {
        return rowIndex === 0 ? '#1976d2' : (rowIndex % 2 === 0 ? '#f5f5f5' : null);
      },
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => '#e0e0e0',
      vLineColor: () => '#e0e0e0'
    },
    margin: [0, 10, 0, 10] as [number, number, number, number]
  };
};

// Función para generar y descargar PDF
export const generateAndDownloadPdf = (docDefinition: Record<string, unknown>, fileName: string) => {
  const pdf = pdfMake.createPdf(docDefinition);
  pdf.download(`${fileName}_${new Date().getTime()}.pdf`);
};

// Función para abrir PDF en nueva ventana
export const generateAndOpenPdf = (docDefinition: Record<string, unknown>) => {
  const pdf = pdfMake.createPdf(docDefinition);
  pdf.open();
};

// Función para crear información en formato clave-valor
export const createInfoRow = (label: string, value: string | number) => {
  return {
    columns: [
      {
        text: label + ':',
        style: 'infoLabel',
        width: 150
      },
      {
        text: String(value),
        style: 'infoValue',
        width: '*'
      }
    ],
    margin: [0, 3, 0, 3] as [number, number, number, number]
  };
};
