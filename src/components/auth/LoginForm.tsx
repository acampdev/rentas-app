import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment, 
  Alert, 
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuthContext } from '../../context/AuthContext';

/**
 * Formulario de inicio de sesión modernizado con Material UI
 */
const LoginForm: React.FC = () => {
  const theme = useTheme();
  const { login, loading, error } = useAuthContext();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!username) {
      setFormError('El nombre de usuario es obligatorio');
      return;
    }
    
    if (!password) {
      setFormError('La contraseña es obligatoria');
      return;
    }
    
    const result = await login({ username, password });
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Paper 
      elevation={6} 
      sx={{ 
        p: 4, 
        width: 380, 
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1)
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Box 
          component="img" 
          src="/escudoMDE.png" 
          alt="Escudo" 
          sx={{ height: 55, mb: 2, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }} 
        />
        <Typography variant="h5" fontWeight={700} color="primary" sx={{ letterSpacing: 1 }}>
          SISTEMA DE RENTAS
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Municipalidad Distrital de La Esperanza
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre de Usuario"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ej: jparedes"
          size="small"
          disabled={loading}
          autoComplete="username"
          autoFocus
        />
        
        <TextField
          fullWidth
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          disabled={loading}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        {(error || formError) && (
          <Alert severity="error" sx={{ mt: 2, py: 0 }}>
            {formError || error}
          </Alert>
        )}
        
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
          style={{ 
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            marginTop: '32px',
            paddingTop: '10px',
            paddingBottom: '10px',
            fontWeight: 700,
            borderRadius: '8px',
          }}
          sx={{ 
            boxShadow: theme.shadows[4],
            '&:hover': {
              backgroundColor: `${theme.palette.primary.dark} !important`,
              opacity: 0.9
            }
          }}
        >
          {loading ? "Verificando..." : "Entrar al Sistema"}
        </Button>
      </form>
    </Paper>
  );
};

export default LoginForm;
