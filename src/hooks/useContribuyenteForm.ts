import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NotificationService } from '../components/utils/Notification';
import { BUSINESS_CODES } from '../config/constants';
import { ContribuyenteDireccion } from '../types/formTypes';
import { PersonaData } from '../services/personaService';
import { ContribuyenteData } from '../services/contribuyenteService';
import { getAuthenticatedUserCode } from '../config/api.unified.config';

export interface ContribuyenteFormValues {
  esPersonaJuridica: boolean;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  razonSocial: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: ContribuyenteDireccion | null;
  nFinca: string;
  otroNumero: string;
  telefono: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: Date | string | null;
  exonerado?: string;
}

interface UseContribuyenteFormProps {
  onSubmit?: (data: {
    persona: PersonaData;
    contribuyente: ContribuyenteData;
    conyugeRepresentante: number | null;
  }) => void | Promise<void>;
  onEdit?: () => void;
  onNew?: () => void;
  initialData?: Partial<ContribuyenteFormValues> & Record<string, any>;
}

export const useContribuyenteForm = ({
  onSubmit,
  onEdit,
  onNew,
  initialData
}: UseContribuyenteFormProps) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [showConyugeRepresentante, setShowConyugeRepresentante] = useState(false);
  const [isDireccionModalOpen, setIsDireccionModalOpen] = useState(false);
  const [isConyugeDireccionModalOpen, setIsConyugeDireccionModalOpen] = useState(false);
  const [tipoContribuyente, setTipoContribuyente] = useState<'natural' | 'juridica'>('natural');

  // Formulario principal
  const principalForm = useForm<ContribuyenteFormValues>({
    defaultValues: {
      esPersonaJuridica: initialData?.esPersonaJuridica || false,
      tipoDocumento: initialData?.tipoDocumento || BUSINESS_CODES.TIPO_DOCUMENTO.DNI,
      numeroDocumento: initialData?.numeroDocumento || '',
      nombres: initialData?.nombres || '',
      razonSocial: initialData?.razonSocial || '',
      apellidoPaterno: initialData?.apellidoPaterno || '',
      apellidoMaterno: initialData?.apellidoMaterno || '',
      direccion: initialData?.direccion || null,
      nFinca: initialData?.nFinca || '',
      otroNumero: initialData?.otroNumero || '',
      telefono: initialData?.telefono || '',
      sexo: initialData?.sexo || BUSINESS_CODES.SEXO.MASCULINO,
      estadoCivil: initialData?.estadoCivil || '',
      fechaNacimiento: initialData?.fechaNacimiento || null,
      exonerado: initialData?.exonerado || 'No'
    },
    mode: 'onBlur'
  });

  // Formulario para cónyuge/representante
  const conyugeRepresentanteForm = useForm<ContribuyenteFormValues>({
    defaultValues: {
      esPersonaJuridica: false,
      tipoDocumento: BUSINESS_CODES.TIPO_DOCUMENTO.DNI,
      numeroDocumento: '',
      nombres: '',
      razonSocial: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      direccion: null,
      nFinca: '',
      otroNumero: '',
      telefono: '',
      sexo: BUSINESS_CODES.SEXO.MASCULINO,
      estadoCivil: '',
      fechaNacimiento: null,
      exonerado: 'No'
    }
  });

  const esPersonaJuridica = tipoContribuyente === 'juridica';

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      const formData: ContribuyenteFormValues = {
        esPersonaJuridica: initialData.esPersonaJuridica || false,
        tipoDocumento: initialData.tipoDocumento || BUSINESS_CODES.TIPO_DOCUMENTO.DNI,
        numeroDocumento: initialData.numeroDocumento || '',
        nombres: initialData.nombres || '',
        razonSocial: initialData.razonSocial || '',
        apellidoPaterno: initialData.apellidoPaterno || '',
        apellidoMaterno: initialData.apellidoMaterno || '',
        direccion: initialData.direccion || null,
        nFinca: initialData.nFinca || '',
        otroNumero: initialData.otroNumero || '',
        telefono: initialData.telefono || '',
        sexo: initialData.sexo || BUSINESS_CODES.SEXO.MASCULINO,
        estadoCivil: initialData.estadoCivil || '',
        fechaNacimiento: initialData.fechaNacimiento || null
      };

      principalForm.reset(formData);
      setTipoContribuyente(initialData.esPersonaJuridica ? 'juridica' : 'natural');
    }
  }, [initialData, principalForm]);

  const handleTipoContribuyenteChange = useCallback((
    _event: React.MouseEvent<HTMLElement>,
    newValue: 'natural' | 'juridica' | null
  ) => {
    if (newValue !== null) {
      setTipoContribuyente(newValue);
      principalForm.setValue('esPersonaJuridica', newValue === 'juridica');
      
      if (newValue === 'juridica') {
        principalForm.setValue('tipoDocumento', BUSINESS_CODES.TIPO_DOCUMENTO.RUC);
        principalForm.setValue('nombres', '');
        principalForm.setValue('apellidoPaterno', '');
        principalForm.setValue('apellidoMaterno', '');
      } else {
        principalForm.setValue('tipoDocumento', BUSINESS_CODES.TIPO_DOCUMENTO.DNI);
        principalForm.setValue('razonSocial', '');
      }
    }
  }, [principalForm]);

  const toggleConyugeForm = useCallback(() => {
    setShowConyugeRepresentante(prev => !prev);
  }, []);

  const handleOpenDireccionModal = useCallback(() => setIsDireccionModalOpen(true), []);
  const handleCloseDireccionModal = useCallback(() => setIsDireccionModalOpen(false), []);
  const handleOpenConyugeDireccionModal = useCallback(() => setIsConyugeDireccionModalOpen(true), []);
  const handleCloseConyugeDireccionModal = useCallback(() => setIsConyugeDireccionModalOpen(false), []);

  const handleSelectDireccion = useCallback((direccion: ContribuyenteDireccion) => {
    principalForm.setValue('direccion', direccion);
    handleCloseDireccionModal();
  }, [principalForm, handleCloseDireccionModal]);

  const handleSelectConyugeDireccion = useCallback((direccion: ContribuyenteDireccion) => {
    conyugeRepresentanteForm.setValue('direccion', direccion);
    handleCloseConyugeDireccionModal();
  }, [conyugeRepresentanteForm, handleCloseConyugeDireccionModal]);

  const getDireccionTextoCompleto = useCallback((direccion: ContribuyenteDireccion | null, nFinca?: string, otroNumero?: string) => {
    if (!direccion) return '';
    let texto = direccion.descripcion || '';
    texto = texto.replace(/,?\s*Lotes?:\s*\d+\s*-?\s*\d*/gi, '').trim();
    texto = texto.replace(/,\s*$/, '').trim();
    if (nFinca) texto += ` - N° Finca: ${nFinca}`;
    if (otroNumero) texto += ` - Otro: ${otroNumero}`;
    return texto;
  }, []);

  const convertirDatosPersona = (formData: ContribuyenteFormValues, esJuridica: boolean) => {
    // Tipo de Documento: DNI: 4101, RUC: 4102, CE: 4103, PASAPORTE: 4104
    let codTipoDocumento = 4101;
    if (formData.tipoDocumento) {
      const parsed = parseInt(formData.tipoDocumento);
      if (!isNaN(parsed) && parsed > 10) {
        codTipoDocumento = parsed;
      } else {
        if (formData.tipoDocumento === BUSINESS_CODES.TIPO_DOCUMENTO.DNI || formData.tipoDocumento === '1') codTipoDocumento = 4101;
        else if (formData.tipoDocumento === BUSINESS_CODES.TIPO_DOCUMENTO.RUC || formData.tipoDocumento === '2') codTipoDocumento = 4102;
        else if (formData.tipoDocumento === BUSINESS_CODES.TIPO_DOCUMENTO.CE) codTipoDocumento = 4103;
        else if (formData.tipoDocumento === BUSINESS_CODES.TIPO_DOCUMENTO.PASAPORTE) codTipoDocumento = 4104;
      }
    }

    // Sexo: Masculino: 2001, Femenino: 2002
    let codSexo = 2001;
    if (formData.sexo) {
      const parsed = parseInt(formData.sexo);
      if (!isNaN(parsed) && parsed > 10) {
        codSexo = parsed;
      } else {
        if (formData.sexo === BUSINESS_CODES.SEXO.MASCULINO || formData.sexo === '1') codSexo = 2001;
        else if (formData.sexo === BUSINESS_CODES.SEXO.FEMENINO || formData.sexo === '2') codSexo = 2002;
      }
    }

    // Estado Civil: Soltero: 1801, Casado: 1802, Viudo: 1803, Divorciado: 1804
    let codEstadoCivil = 1801;
    if (formData.estadoCivil) {
      const parsed = parseInt(formData.estadoCivil);
      if (!isNaN(parsed) && parsed > 10) {
        codEstadoCivil = parsed;
      } else {
        if (formData.estadoCivil === BUSINESS_CODES.ESTADO_CIVIL.SOLTERO || formData.estadoCivil === '1' || formData.estadoCivil === 'SOLTERO') codEstadoCivil = 1801;
        else if (formData.estadoCivil === BUSINESS_CODES.ESTADO_CIVIL.CASADO || formData.estadoCivil === '2' || formData.estadoCivil === 'CASADO') codEstadoCivil = 1802;
        else if (formData.estadoCivil === BUSINESS_CODES.ESTADO_CIVIL.VIUDO || formData.estadoCivil === '3' || formData.estadoCivil === 'VIUDO') codEstadoCivil = 1803;
        else if (formData.estadoCivil === BUSINESS_CODES.ESTADO_CIVIL.DIVORCIADO || formData.estadoCivil === '4' || formData.estadoCivil === 'DIVORCIADO') codEstadoCivil = 1804;
      }
    }

    return {
      codPersona: null,
      codTipopersona: esJuridica ? BUSINESS_CODES.TIPO_PERSONA.JURIDICA : BUSINESS_CODES.TIPO_PERSONA.NATURAL,
      codTipoDocumento: codTipoDocumento,
      numerodocumento: formData.numeroDocumento?.toString() || '',
      nombres: esJuridica ? formData.razonSocial : formData.nombres,
      apellidomaterno: formData.apellidoMaterno || '',
      apellidopaterno: formData.apellidoPaterno || '',
      fechanacimiento: formData.fechaNacimiento ? 
        (formData.fechaNacimiento instanceof Date ? 
          formData.fechaNacimiento.toISOString().split('T')[0] : 
          formData.fechaNacimiento.split('T')[0]) : "1980-01-01",
      codestadocivil: codEstadoCivil,
      codsexo: codSexo,
      telefono: formData.telefono?.toString() || '',
      codDireccion: formData.direccion?.id || 1,
      lote: formData.nFinca?.toString() || null,
      otros: formData.otroNumero?.toString() || null,
      parametroBusqueda: null,
      codUsuario: getAuthenticatedUserCode()
    };
  };

  const handleNuevo = useCallback(() => {
    principalForm.clearErrors();
    conyugeRepresentanteForm.clearErrors();
    principalForm.reset({
      esPersonaJuridica: false,
      tipoDocumento: BUSINESS_CODES.TIPO_DOCUMENTO.DNI,
      numeroDocumento: '',
      nombres: '',
      razonSocial: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      direccion: null,
      nFinca: '',
      otroNumero: '',
      telefono: '',
      sexo: BUSINESS_CODES.SEXO.MASCULINO,
      estadoCivil: '',
      fechaNacimiento: null
    });
    conyugeRepresentanteForm.reset({
      esPersonaJuridica: false,
      tipoDocumento: BUSINESS_CODES.TIPO_DOCUMENTO.DNI,
      numeroDocumento: '',
      nombres: '',
      razonSocial: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      direccion: null,
      nFinca: '',
      otroNumero: '',
      telefono: '',
      sexo: BUSINESS_CODES.SEXO.MASCULINO,
      estadoCivil: '',
      fechaNacimiento: null
    });
    setShowConyugeRepresentante(false);
    setTipoContribuyente('natural');
    if (onNew) onNew();
  }, [principalForm, conyugeRepresentanteForm, onNew]);

  const handleEditar = useCallback(() => {
    if (onEdit) onEdit();
  }, [onEdit]);

  const handleSubmit = principalForm.handleSubmit(async (data) => {
    try {
      setInternalLoading(true);
      const { personaService } = await import('../services/personaService');
      const { contribuyenteService } = await import('../services/contribuyenteService');

      const personaPrincipalData = convertirDatosPersona(data, esPersonaJuridica);
      const personaPrincipal = await personaService.crearPersonaAPI(personaPrincipalData);

      if (!personaPrincipal || !personaPrincipal.codPersona) {
        console.error('❌ [useContribuyenteForm] Error al crear persona principal, respuesta:', personaPrincipal);
        throw new Error('Error al crear persona principal: El servidor no retornó un código de persona válido.');
      }

      let conyugeRepresentanteId: number | null = null;
      if (showConyugeRepresentante) {
        const conyugeData = conyugeRepresentanteForm.getValues();
        if (conyugeData.numeroDocumento && (conyugeData.nombres || conyugeData.razonSocial)) {
          const conyugePersonaData = convertirDatosPersona(conyugeData, false);
          const conyugePersona = await personaService.crearPersonaAPI(conyugePersonaData);
          if (conyugePersona && conyugePersona.codPersona) {
            conyugeRepresentanteId = conyugePersona.codPersona;
          }
        }
      }

      const contribuyenteAPIData = {
        codPersona: personaPrincipal.codPersona,
        codConyuge: conyugeRepresentanteId,
        codRepresentanteLegal: esPersonaJuridica ? conyugeRepresentanteId : null,
        codestado: "0201",
        codUsuario: getAuthenticatedUserCode()
      };
      
      const contribuyente = await contribuyenteService.crearContribuyenteAPI(contribuyenteAPIData);
      
      if (!contribuyente) throw new Error('Error al crear contribuyente');
      
      NotificationService.success('Contribuyente registrado exitosamente');

      if (onSubmit) {
        await onSubmit({
          persona: personaPrincipal,
          contribuyente: contribuyente,
          conyugeRepresentante: conyugeRepresentanteId
        });
      }

      handleNuevo();
    } catch (error: any) {
      console.error(error);
      NotificationService.error(error.message || 'Error al guardar contribuyente');
    } finally {
      setInternalLoading(false);
    }
  });

  return {
    principalForm,
    conyugeRepresentanteForm,
    internalLoading,
    showConyugeRepresentante,
    isDireccionModalOpen,
    isConyugeDireccionModalOpen,
    tipoContribuyente,
    esPersonaJuridica,
    handleTipoContribuyenteChange,
    toggleConyugeForm,
    handleOpenDireccionModal,
    handleCloseDireccionModal,
    handleOpenConyugeDireccionModal,
    handleCloseConyugeDireccionModal,
    handleSelectDireccion,
    handleSelectConyugeDireccion,
    getDireccionTextoCompleto,
    handleNuevo,
    handleEditar,
    handleSubmit
  };
};
