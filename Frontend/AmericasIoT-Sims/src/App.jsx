import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Users from './pages/Users'
import Clientes, { EditarCliente } from './pages/Admin/Clientes'
import Sims from './pages/Admin/Sims'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/clientes"
        element={
          <ProtectedRoute requiredRole="admin">
            <Clientes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/clientes/editar/:id"
        element={
          <ProtectedRoute requiredRole="admin">
            <EditarCliente />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/sims"
        element={
          <ProtectedRoute requiredRole="admin">
            <Sims />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute requiredRole="user">
            <Users />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
