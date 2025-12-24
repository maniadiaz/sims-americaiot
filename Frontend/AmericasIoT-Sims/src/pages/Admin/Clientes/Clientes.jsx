import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { userService } from '../../../services';

const Clientes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Estados para modales
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const observerTarget = useRef(null);

  useEffect(() => {
    if (isMobile) {
      // Reiniciar para móvil
      setUsers([]);
      setMobileCurrentPage(1);
      fetchUsersForMobile(1, true);
    } else {
      // Cargar para escritorio
      fetchUsers();
    }
  }, [page, rowsPerPage, isMobile]);

  // Fetch para escritorio (tabla con paginación)
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getUsers(page + 1, rowsPerPage);

      if (response.success) {
        setUsers(response.users || []);
        setPagination(response.pagination || {});
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Fetch para móvil (infinite scroll)
  const fetchUsersForMobile = async (pageNum, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError('');

    try {
      const response = await userService.getUsers(pageNum, 15);

      if (response.success) {
        if (isInitial) {
          setUsers(response.users || []);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...(response.users || [])]);
        }
        setPagination(response.pagination || {});
        setMobileCurrentPage(pageNum);
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasNextPage && !loadingMore && !loading) {
          fetchUsersForMobile(mobileCurrentPage + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isMobile, pagination.hasNextPage, loadingMore, loading, mobileCurrentPage]);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (rol) => {
    switch (rol?.toLowerCase()) {
      case 'admin':
        return 'primary';
      case 'usuario':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Handlers para acciones
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/clientes/editar/${userId}`);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setDeleting(true);
    try {
      const response = await userService.updateUser(selectedUser.id, {
        status: 'inactivo'
      });

      if (response.success) {
        // Actualizar la lista de usuarios
        if (isMobile) {
          fetchUsersForMobile(1, true);
        } else {
          fetchUsers();
        }
        setDeleteModalOpen(false);
        setSelectedUser(null);
      } else {
        setError(response.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Renderizado de vista móvil (Cards con infinite scroll)
  const renderMobileView = () => (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && users.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No hay usuarios registrados
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid item xs={12} key={user.id} sx={{minWidth: '100%'}}>
                <Card
                  sx={{
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user.nombre} {user.apellidos}
                      </Typography>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        <strong>Email:</strong> {user.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        <strong>Usuario:</strong> {user.username}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Rol:</strong>
                        </Typography>
                        <Chip
                          label={user.rol}
                          color={getRoleColor(user.rol)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewUser(user)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Observer target para infinite scroll */}
          <Box ref={observerTarget} sx={{ py: 2, textAlign: 'center' }}>
            {loadingMore && <CircularProgress size={30} />}
            {!pagination.hasNextPage && users.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay más usuarios
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );

  // Renderizado de vista escritorio (Tabla con paginación)
  const renderDesktopView = () => (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Apellidos</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No hay usuarios registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.apellidos}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.rol}
                        color={getRoleColor(user.rol)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewUser(user)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 15, 25, 50]}
          component="div"
          count={pagination.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>
    </>
  );

  return (
    <Layout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Gestión de Clientes
        </Typography>

        {isMobile ? renderMobileView() : renderDesktopView()}
      </Box>

      {/* Modal de Ver Detalles */}
      <Dialog
        open={viewModalOpen}
        onClose={handleCloseModals}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Detalles del Cliente
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>ID:</strong> {selectedUser.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Nombre:</strong> {selectedUser.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Apellidos:</strong> {selectedUser.apellidos}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Usuario:</strong> {selectedUser.username}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Rol:</strong>
                  </Typography>
                  <Chip
                    label={selectedUser.rol}
                    color={getRoleColor(selectedUser.rol)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Estado:</strong>
                  </Typography>
                  <Chip
                    label={selectedUser.status}
                    color={getStatusColor(selectedUser.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{py: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              handleCloseModals();
              handleEditUser(selectedUser?.id);
            }}
            startIcon={<EditIcon />}
          >
            { isMobile ? (
              "Editar"
            ):(
              "Editar Información"
            )}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setViewModalOpen(false);
              handleDeleteClick(selectedUser);
            }}
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
          <Button onClick={handleCloseModals} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseModals}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            ¿Estás seguro de que deseas dar de baja al usuario?
          </Typography>
          {selectedUser && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedUser.nombre} {selectedUser.apellidos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser.email}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta acción cambiará el estado del usuario a "Inactivo".
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseModals} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? 'Eliminando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Clientes;
