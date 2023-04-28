import React from 'react';
import LoginForm from './LoginForm';
import GoogleLoginButton from './GoogleLoginButton';
import { Box, Typography } from '@mui/material';

const AuthPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" mb={2}>Sign In / Register</Typography>
      <LoginForm />
      <Typography variant="body1" mt={2} mb={2}>Or</Typography>
      <GoogleLoginButton />
    </Box>
  );
};

export default AuthPage;