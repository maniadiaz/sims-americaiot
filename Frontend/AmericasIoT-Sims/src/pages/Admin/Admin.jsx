import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { People, SimCard, Dashboard } from '@mui/icons-material';
import Layout from './components/Layout';

const Admin = () => {
  const stats = [
    {
      title: 'Total Clientes',
      value: '0',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#667eea',
    },
    {
      title: 'Total Sims',
      value: '0',
      icon: <SimCard sx={{ fontSize: 40 }} />,
      color: '#764ba2',
    },
    {
      title: 'Sims Activas',
      value: '0',
      icon: <Dashboard sx={{ fontSize: 40 }} />,
      color: '#43a047',
    },
  ];

  return (
    <Layout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Panel de Administración
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}40 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Bienvenido al sistema
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Desde aquí puedes gestionar clientes, SIM cards y visualizar estadísticas del sistema.
            Utiliza el menú lateral para navegar entre las diferentes secciones.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Admin;
