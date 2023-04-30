import axios from 'axios';

const sign_in_url = 'http://127.0.0.1:8000/sign_in';
const sign_up_url = 'http://127.0.0.1:8000/sign_up';

export const signIn = async (email, password) => {
  console.log("email:", email)
  console.log( "password:", password)

  try {
    const response = await axios.post(sign_in_url, { email: email, password: password });

    // Return the access token and user_id as an object
    return {
      access_token: response.data.access_token,
      user_id: response.data.user_id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signUp = async (email, password) => {
  console.log("email:", email)
  console.log( "password:", password)

  try {
    const response = await axios.post(sign_up_url, {
      email: email,
      password: password,
    });

    const token = await signIn(email, password);

    return token;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};







