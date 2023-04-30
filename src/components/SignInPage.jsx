import React from 'react';
import SignInForm from './SignInForm';
import { Box, Typography } from '@mui/material';
import { signIn } from "../utils/Auth"
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();
  
  const handleSignIn = async (email, password) => {
    console.log('Email:', email, 'Password:', password);

    try {
      const data = await signIn(email, password);

      if (data) {
        console.log('SignIn successful:', data);
        localStorage.setItem('access_token', data.access_token); // トークンをLocal Storageに保存
        localStorage.setItem('user_id', data.user_id); // ユーザーIDをLocal Storageに保存
  
        navigate('/my_page'); // リダイレクト処理
      } else {
        console.error('Error during SignIn');
      }
    } catch (error) {
      console.error('SignIn error:', error);
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
      <Typography variant="h4" mb={2}>Sign In</Typography>
      <SignInForm onSignIn={handleSignIn} />
    </Box>
  );
};

export default SignInPage;
