import {
  Box,
  Radio,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Terrain as TerrainIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../../utils/formatters';
import { getPredioAddress, getPredioCode, getPredioKey } from '../selectorPredio.utils';
import { SelectorPredioPagination } from './SelectorPredioPagination';
import type { SelectorPredioListProps } from './selectorPredio.types';

interface DesktopTableProps extends SelectorPredioListProps {
  order: 'asc' | 'desc';
  onSort: () => void;
}

export const SelectorPredioDesktopTable = ({
  predios,
  selectedPredio,
  order,
  count,
  page,
  rowsPerPage,
  onSelect,
  onSort,
  onPageChange,
  onRowsPerPageChange,
}: DesktopTableProps) => {
  const theme = useTheme();
  const selectedKey = getPredioKey(selectedPredio);

  return (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <TableContainer sx={{
        flex: 1,
        overflowY: 'auto',
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
        '&::-webkit-scrollbar': { width: 8 },
        '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.primary.main, 0.4), borderRadius: 4 },
      }}>
        <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-head': headerCellSx(theme.palette.primary.main) }}>
              <TableCell padding="checkbox" sx={{ width: '5%', textAlign: 'center' }}>Sel.</TableCell>
              <TableCell align="center" sx={{ width: '10%' }}>
                <TableSortLabel
                  active
                  direction={order}
                  onClick={onSort}
                  sx={{
                    color: 'white !important',
                    '&:hover': { color: 'white' },
                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <HomeIcon sx={{ fontSize: 14, color: 'white' }} />Código
                  </Stack>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '35%' }}><Header icon={<LocationIcon />} label="Dirección" /></TableCell>
              <TableCell align="right" sx={{ width: '12%' }}><Header icon={<TerrainIcon />} label="Área m²" end /></TableCell>
              <TableCell align="center" sx={{ width: '20%' }}><Header icon={<PersonIcon />} label="Conductor" /></TableCell>
              <TableCell align="center" sx={{ width: '18%' }}><Header icon={<MoneyIcon color="success" />} label="Valor terreno" /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predios.map((predio, index) => {
              const currentKey = getPredioKey(predio);
              const isSelected = selectedKey !== null && selectedKey === currentKey;
              return (
                <TableRow
                  key={currentKey || index}
                  hover
                  selected={isSelected}
                  onClick={() => onSelect(predio)}
                  sx={{
                    cursor: 'pointer',
                    height: 60,
                    borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.2) : index % 2 ? alpha(theme.palette.grey[50], 0.4) : 'transparent',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, isSelected ? 0.3 : 0.06) },
                  }}
                >
                  <TableCell padding="checkbox" align="center"><Radio checked={isSelected} size="small" /></TableCell>
                  <TableCell align="center"><Typography variant="body2" fontWeight={isSelected ? 600 : 500}>{getPredioCode(predio) || 'Sin código'}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: isSelected ? 600 : 500 }}>{getPredioAddress(predio)}</Typography></TableCell>
                  <TableCell align="right">{predio.areaTerreno?.toFixed(1) || '0.0'} m²</TableCell>
                  <TableCell align="center"><Typography noWrap variant="body2">{predio.conductor || 'Sin conductor'}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2" fontWeight={600} color="success.main">{formatCurrency(predio.valorTerreno || 0)}</Typography></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <SelectorPredioPagination count={count} page={page} rowsPerPage={rowsPerPage} onPageChange={onPageChange} onRowsPerPageChange={onRowsPerPageChange} />
    </Box>
  );
};

const Header = ({ icon, label, end = false }: { icon: React.ReactNode; label: string; end?: boolean }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent={end ? 'flex-end' : 'center'}
    spacing={0.5}
    sx={{ color: 'white', '& svg': { fontSize: 14, color: 'white' } }}
  >
    {icon}<Typography variant="caption" fontWeight={700}>{label}</Typography>
  </Stack>
);

const headerCellSx = (primary: string) => ({
  backgroundColor: `${primary} !important`,
  backgroundImage: 'none',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.75rem',
  py: 1.5,
  borderBottom: '2px solid rgba(255, 255, 255, 0.45)',
  boxShadow: '0 3px 8px rgba(15, 23, 42, 0.28)',
  position: 'sticky',
  top: 0,
  zIndex: 3,
});
