import React from 'react';
import AuthForm from './AuthForm';

const SignInForm = ({ onSignIn }) => {
  const handleSignIn = (email, password) => {
    onSignIn(email, password);
  };

  return <AuthForm onSubmit={handleSignIn} buttonText="Sign In" />;
};

export default SignInForm;
