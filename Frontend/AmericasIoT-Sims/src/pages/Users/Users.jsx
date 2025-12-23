import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { People, Logout } from '@mui/icons-material';
import { authService } from '../../services';

const Users = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <People sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Panel de Usuarios
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Bienvenido al panel de usuarios. Aquí puedes ver y gestionar tu información.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Users;
