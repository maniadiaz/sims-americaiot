import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Login as LoginIcon, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../../services';

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const identifierRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(credentials.identifier, credentials.password);

      if (response.success) {
        // El authService ya almacena el token y el rol en localStorage
        const userRole = authService.getUserRole();

        // Redirigir según el rol del usuario
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/users');
        }
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputFocus = (ref) => {
    // Solo hacer scroll en dispositivos móviles (ancho menor a 900px)
    const isMobile = window.innerWidth < 900;

    if (ref.current && isMobile) {
      setTimeout(() => {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        overflow: 'hidden',
        '@keyframes gradientShift': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 440, md: 480 },
          padding: { xs: 3, sm: 4, md: 5 },
          borderRadius: { xs: 2, sm: 3, md: 4 },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.5)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: { xs: 60, sm: 70, md: 80 },
              height: { xs: 60, sm: 70, md: 80 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            }}
          >
            <LockOutlined sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: 'white' }} />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            Bienvenido
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
            }}
          >
            Ingresa tus credenciales para continuar
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="identifier"
              label="Usuario o Email"
              name="identifier"
              autoComplete="username email"
              autoFocus
              value={credentials.identifier}
              onChange={handleChange}
              onFocus={() => handleInputFocus(identifierRef)}
              disabled={loading}
              ref={identifierRef}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              onFocus={() => handleInputFocus(passwordRef)}
              disabled={loading}
              ref={passwordRef}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                mt: 1,
                mb: 2,
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: 2,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  opacity: 0.6,
                },
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
