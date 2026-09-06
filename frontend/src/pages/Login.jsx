import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch {
      // el error ya queda en el contexto (no se lanza al usuario)
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #00adb7 0%, #008a92 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 16px 48px rgba(0, 32, 36, 0.28)' }}>
          <Stack spacing={3} component="form" onSubmit={enviar} noValidate>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="img" src="/images/logo-gris.svg" alt="Municipalidad de Santa Rosa de Calamuchita" sx={{ height: 48, mb: 1.5 }} />
              <Typography variant="h5" sx={{ color: 'text.primary' }}>
                Panel de administración
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresá con tu cuenta para administrar la guía
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button type="submit" variant="contained" size="large" disabled={loading || !email || !password} fullWidth>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              <Link component={RouterLink} to="/" underline="hover">
                Volver a la guía de alojamientos
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}