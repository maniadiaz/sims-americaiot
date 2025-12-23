import { Box, Typography, Paper } from '@mui/material';
import Layout from '../components/Layout';

const Sims = () => {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Gestión de Sims
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Aquí podrás gestionar todas las tarjetas SIM del sistema.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Sims;
