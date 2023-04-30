import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const get_user_url = 'http://127.0.0.1:8000/user/me';

const MyPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(get_user_url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Error fetching user data:', response.status, response.statusText);
      }
    };

    fetchUserData();
  }, []);


  if (!user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h6">Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" mb={2}>User Information</Typography>
      <Typography variant="h6">ID: {user.id}</Typography>
      <Typography variant="h6">Email: {user.email}</Typography>
      <Box mt={2}>
        <Avatar src={user.avatar_url} alt="User Avatar" />
      </Box>
    </Box>
  );
};

export default MyPage;