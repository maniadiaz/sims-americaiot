import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { userService } from '../../../services';

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    username: '',
    rol: 'usuario',
    status: 'activo'
  });

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getUserById(id);

      if (response && response.success && response.user) {
        const user = response.user;
        setFormData({
          nombre: user.nombre || '',
          apellidos: user.apellidos || '',
          email: user.email || '',
          username: user.username || '',
          rol: user.rol || 'usuario',
          status: user.status || 'activo'
        });
      } else {
        setError('Usuario no encontrado');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      setSaving(false);
      return;
    }

    if (!formData.apellidos.trim()) {
      setError('Los apellidos son obligatorios');
      setSaving(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      setSaving(false);
      return;
    }

    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      setSaving(false);
      return;
    }

    try {
      const response = await userService.updateUser(id, formData);

      if (response.success) {
        setSuccess('Usuario actualizado correctamente');
        setTimeout(() => {
          navigate('/admin/clientes');
        }, 1500);
      } else {
        setError(response.message || 'Error al actualizar el usuario');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/clientes');
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{
              mr: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Volver
          </Button>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Editar Cliente
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(244, 67, 54, 0.1)'
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)'
            }}
          >
            {success}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(250,250,255,1) 100%)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Información del Usuario
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} minWidth={isMobile?"100%":"45%"}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={saving}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} minWidth={isMobile?"100%":"45%"}>
                <TextField
                  fullWidth
                  required
                  label="Apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  disabled={saving}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} minWidth={isMobile?"100%":"45%"}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={saving}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} minWidth={isMobile?"100%":"45%"}>
                <TextField
                  fullWidth
                  required
                  label="Nombre de Usuario"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={saving}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} minWidth={isMobile?"100%":"45%"}>
                <FormControl
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                    },
                  }}
                >
                  <InputLabel>Rol</InputLabel>
                  <Select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    label="Rol"
                    disabled={saving}
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="usuario">Usuario</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} minWidth={isMobile?"100%":"45%"}>
                <FormControl
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                    },
                  }}
                >
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Estado"
                    disabled={saving}
                  >
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    pt: 2,
                    mt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 500,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={saving}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
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
                      transition: 'all 0.3s'
                    }}
                  >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default EditarCliente;
