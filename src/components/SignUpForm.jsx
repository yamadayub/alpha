import React from 'react';
import AuthForm from './AuthForm';

const SignUpForm = ({ onSignUp }) => {
  const handleSignUp = (email, password) => {
    onSignUp(email, password);
  };

  return <AuthForm onSubmit={handleSignUp} buttonText="Sign Up" />;
};

export default SignUpForm;
