import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated, loginUser } from 'helpers/apiHelper';

// Material-UI
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';

// Project imports
import AuthWrapper from 'sections/auth/AuthWrapper';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isAuthenticated();
      if (loggedIn) {
        navigate('/dashboard/default'); // Redirect to dashboard if authenticated
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async () => {
    setError(null);
    const result = await loginUser(email, password);

    if (result.success) {
      navigate('/dashboard/default'); // Redirect after login
    } else {
      setError(result.error);
    }
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography component={Link} to={'/register'} variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don&apos;t have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <Typography color="error">{error}</Typography>}
            <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
          </Stack>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
