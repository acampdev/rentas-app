import { afterEach, describe, expect, it, vi } from 'vitest';
import { contribuyenteService } from './contribuyenteService';

const apiItem = {
  codPersona: 1,
  codContribuyente: 1,
  codTipopersona: '0301',
  codTipoDocumento: '1',
  numerodocumento: '40953876',
  nombres: 'Aydee Zenobia',
  apellidopaterno: 'Castro',
  apellidomaterno: 'Ramirez',
  direccion: 'AA.HH. Nuevo Jerusalen',
  tipoContribuyente: 'Natural'
};

describe('ContribuyenteService selector contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('loads the full register from the base endpoint when there are no filters', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      success: true,
      data: [apiItem]
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await contribuyenteService.buscarContribuyentes({});

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      '/api/contribuyente?codigoContribuyente=&codigoPersona='
    );
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('/general');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      codigo: 1,
      codigoPersona: 1,
      numeroDocumento: '40953876',
      nombreCompleto: 'Castro Ramirez Aydee Zenobia'
    });
  });
});
