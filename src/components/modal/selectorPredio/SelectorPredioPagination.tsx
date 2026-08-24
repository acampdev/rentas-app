import { Box, TablePagination, Typography } from '@mui/material';
import type { SelectorPredioPaginationProps } from './selectorPredio.types';

export const SelectorPredioPagination = ({
  count,
  page,
  rowsPerPage,
  mobile = false,
  onPageChange,
  onRowsPerPageChange,
}: SelectorPredioPaginationProps) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 2,
    py: 1,
    borderTop: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    flexShrink: 0,
  }}>
    <Typography variant="caption" color="text.secondary">
      {count > 0
        ? `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, count)} de ${count}`
        : 'Sin resultados'}
    </Typography>
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage={mobile ? '' : 'Filas:'}
      labelDisplayedRows={() => ''}
      rowsPerPageOptions={mobile ? [5, 8, 10] : [5, 10, 15, 20]}
      sx={{
        '.MuiTablePagination-toolbar': { minHeight: mobile ? 36 : 40, px: mobile ? 0 : 2 },
        ...(mobile ? { '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { display: 'none' } } : {}),
        '.MuiTablePagination-select': { fontSize: mobile ? '0.7rem' : '0.75rem', mr: 1 },
        '.MuiTablePagination-actions': { ml: mobile ? 1 : 2, '& .MuiIconButton-root': { p: 0.75 } },
      }}
    />
  </Box>
);
