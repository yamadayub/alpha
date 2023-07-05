import React, {useContext, useEffect, useState} from 'react';
import SignInForm from './SignInForm';
import { UserContext } from '../utils/UserContext';
import { Box, Typography } from '@mui/material';
import { signIn } from "../utils/Auth"
import { useNavigate } from 'react-router-dom';
const get_user_url = 'http://127.0.0.1:8000/user/me';

const SignInPage = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const resizeListener = () => {
      setVh(window.innerHeight);
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);
  
  const handleSignIn = async (email, password) => {
    console.log('Email:', email, 'Password:', password);

    try {
      const data = await signIn(email, password);

      if (data) {
        console.log('SignIn successful:', data);
        localStorage.setItem('access_token', data.access_token); // トークンをLocal Storageに保存
        localStorage.setItem('user_id', data.user_id); // ユーザーIDをLocal Storageに保存
        // ログインしたユーザーデータを取得して、setUserを呼び出す
        const userResponse = await fetch(get_user_url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.access_token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
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
      // backgroundColor="#81c784"
      height="calc(100vh - 70px - 70px)"
      flex={1} 
    >
      <Typography variant="h4" mb={2}>Sign In</Typography>
        <SignInForm onSignIn={handleSignIn} />
    </Box>
  );
};

export default SignInPage;
