import React from 'react';
import SignUpForm from './SignUpForm';
import { Box, Typography } from '@mui/material';
import { signUp } from "../utils/Auth";
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignUp = async (email, password) => {
    try {
      const token = await signUp(email, password);

      if (token) {
        localStorage.setItem('access_token', token.access_token);
        navigate('/my_page');
      } else {
        console.log('Sign up failed');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" mb={2}>Sign Up</Typography>
      <SignUpForm onSignUp={handleSignUp} />
    </Box>
  );
};

export default SignUpPage;