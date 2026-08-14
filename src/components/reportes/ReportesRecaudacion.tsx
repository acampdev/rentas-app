// src/components/reportes/ReportesRecaudacion.tsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  MenuItem,
  TextField,
  useTheme,
  alpha,
  Avatar,
  Tooltip,
  IconButton,
  Alert,
  Grid
} from '@mui/material';

import {
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  AccountBalance as BankIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  Gavel as GavelIcon,
  ArrowUpward as ArrowUpIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Colores modernos para gráficos
const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number | string;
    payload: any;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={4} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>{label}</Typography>
        <Stack spacing={0.5}>
          {payload.map((entry, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color }} />
              <Typography variant="body2" color="text.secondary">
                {entry.name}: <strong>S/ {Number(entry.value).toLocaleString('es-PE')}</strong>
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    );
  }
  return null;
};

const ReportesRecaudacion: React.FC = () => {
  const theme = useTheme();
  const [periodo, setPeriodo] = useState('2024');

  const datosRecaudacionMensual = useMemo(() => [
    { mes: 'Ene', impPredial: 45000, arbitrios: 12000, alcabala: 8000, multas: 3500 },
    { mes: 'Feb', impPredial: 48000, arbitrios: 13500, alcabala: 9500, multas: 4200 },
    { mes: 'Mar', impPredial: 52000, arbitrios: 14000, alcabala: 11000, multas: 4800 },
    { mes: 'Abr', impPredial: 47000, arbitrios: 13800, alcabala: 9800, multas: 4100 },
    { mes: 'May', impPredial: 55000, arbitrios: 15000, alcabala: 12000, multas: 5500 },
    { mes: 'Jun', impPredial: 58000, arbitrios: 16200, alcabala: 13500, multas: 6000 },
    { mes: 'Jul', impPredial: 61000, arbitrios: 17000, alcabala: 14000, multas: 6500 },
    { mes: 'Ago', impPredial: 59000, arbitrios: 16500, alcabala: 13200, multas: 6200 },
    { mes: 'Sep', impPredial: 62000, arbitrios: 17500, alcabala: 15000, multas: 7000 },
    { mes: 'Oct', impPredial: 64000, arbitrios: 18000, alcabala: 15500, multas: 7200 },
    { mes: 'Nov', impPredial: 66000, arbitrios: 18500, alcabala: 16000, multas: 7500 },
    { mes: 'Dic', impPredial: 70000, arbitrios: 20000, alcabala: 18000, multas: 8000 }
  ], []);

  const datosDistribucion = useMemo(() => [
    { nombre: 'Impuesto Predial', valor: 687000 },
    { nombre: 'Arbitrios', valor: 192000 },
    { nombre: 'Alcabala', valor: 155500 },
    { nombre: 'Multas', valor: 70500 }
  ], []);

  const datosTendencia = useMemo(() => [
    { periodo: '2020', total: 850000 },
    { periodo: '2021', total: 920000 },
    { periodo: '2022', total: 980000 },
    { periodo: '2023', total: 1050000 },
    { periodo: '2024', total: 1105000 }
  ], []);

  const totales = useMemo(() => {
    const total = datosRecaudacionMensual.reduce((acc, mes) => ({
      impPredial: acc.impPredial + mes.impPredial,
      arbitrios: acc.arbitrios + mes.arbitrios,
      alcabala: acc.alcabala + mes.alcabala,
      multas: acc.multas + mes.multas
    }), { impPredial: 0, arbitrios: 0, alcabala: 0, multas: 0 });

    const totalGeneral = total.impPredial + total.arbitrios + total.alcabala + total.multas;

    return { ...total, totalGeneral };
  }, [datosRecaudacionMensual]);

  interface SummaryCardProps {
    title: string;
    value: number;
    icon: React.ReactElement;
    color: string;
    trend?: string;
    percentage?: string;
  }

  const SummaryCard = ({ title, value, icon, color, trend, percentage }: SummaryCardProps) => (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 3, 
        border: '1px solid', 
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[4] }
      }}
    >
      <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.05, transform: 'rotate(15deg)' }}>
        {React.cloneElement(icon, { sx: { fontSize: 100 } } as React.SVGProps<SVGSVGElement>)}
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar 
              sx={{ 
                bgcolor: alpha(color, 0.1), 
                color: color,
                width: 42,
                height: 42,
                borderRadius: 2
              }}
            >
              {icon}
            </Avatar>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="text.primary">
              S/ {value.toLocaleString('es-PE')}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <ArrowUpIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" fontWeight={700}>{trend}</Typography>
                </Box>
              )}
              {percentage && (
                <Chip 
                  label={percentage} 
                  size="small" 
                  sx={{ 
                    height: 20, 
                    fontSize: '0.65rem', 
                    fontWeight: 700,
                    bgcolor: alpha(color, 0.05),
                    color: color,
                    border: '1px solid',
                    borderColor: alpha(color, 0.2)
                  }} 
                />
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );


  return (
    <Stack spacing={4}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            Recaudación y Métricas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualización analítica de los ingresos municipales del periodo {periodo}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            size="small"
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            <MenuItem value="2024">Año 2024</MenuItem>
            <MenuItem value="2023">Año 2023</MenuItem>
            <MenuItem value="2022">Año 2022</MenuItem>
          </TextField>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            size="medium"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Exportar Dashboard
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard 
            title="Ingresos Totales" 
            value={totales.totalGeneral} 
            icon={<BankIcon />} 
            color={theme.palette.primary.main}
            trend="+12.5%"
            percentage="Meta 94%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard 
            title="Impuesto Predial" 
            value={totales.impPredial} 
            icon={<HomeIcon />} 
            color="#6366F1"
            trend="+8.2%"
            percentage="62.2% del total"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard 
            title="Arbitrios Municipales" 
            value={totales.arbitrios} 
            icon={<AssessmentIcon />} 
            color="#10B981"
            trend="+15.0%"
            percentage="17.4% del total"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard 
            title="Multas y Alcabala" 
            value={totales.alcabala + totales.multas} 
            icon={<GavelIcon />} 
            color="#EF4444"
            trend="+4.3%"
            percentage="20.4% del total"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700}>Recaudación Mensual por Concepto</Typography>
              <Tooltip title="Muestra el desglose de ingresos mes a mes">
                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
              </Tooltip>
            </Box>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={datosRecaudacionMensual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.5)} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                <Bar dataKey="impPredial" name="Predial" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="arbitrios" name="Arbitrios" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="alcabala" name="Alcabala" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="multas" name="Multas" fill={COLORS[3]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>Distribución Proporcional</Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={datosDistribucion}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="valor"
                >
                  {datosDistribucion.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `S/ ${Number(value ?? 0).toLocaleString('es-PE')}`} />
              </PieChart>
            </ResponsiveContainer>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {datosDistribucion.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                    <Typography variant="body2" color="text.secondary">{item.nombre}</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={700}>
                    {((Number(item.valor) / totales.totalGeneral) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              border: '1px solid', 
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>Crecimiento Interanual (5 años)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={datosTendencia}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="periodo" axisLine={false} tickLine={false} />
                <YAxis hide />
                <RechartsTooltip />
                <Line type="monotone" dataKey="total" stroke={theme.palette.primary.main} strokeWidth={4} dot={{ r: 6, fill: theme.palette.primary.main, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              border: '1px solid', 
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>Progreso Acumulado {periodo}</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={datosRecaudacionMensual.map((_item, index) => ({
                  ..._item,
                  acumulado: datosRecaudacionMensual
                    .slice(0, index + 1)
                    .reduce((sum, m) => sum + m.impPredial + m.arbitrios + m.alcabala + m.multas, 0)
                }))}
              >
                <defs>
                  <linearGradient id="colorAcum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} />
                <YAxis hide />
                <RechartsTooltip />
                <Area type="monotone" dataKey="acumulado" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorAcum)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ 
          borderRadius: 3, 
          bgcolor: alpha(theme.palette.info.main, 0.05),
          border: '1px solid',
          borderColor: alpha(theme.palette.info.main, 0.2)
        }}
      >
        <Typography variant="caption">
          Los datos mostrados corresponden a la recaudación procesada y conciliada por Tesorería Municipal. 
          Última actualización: {new Date().toLocaleString('es-PE')}.
        </Typography>
      </Alert>
    </Stack>
  );
};

export default ReportesRecaudacion;
