import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme.js';
import { AlojamientosProvider } from './context/AlojamientosContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Footer from './components/Footer.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function Cargando() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Cargando />}>
            <Routes>
              <Route
                path="/"
                element={
                  <AlojamientosProvider>
                    <Home />
                    <Footer />
                  </AlojamientosProvider>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}