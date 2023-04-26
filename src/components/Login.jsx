import React, { useEffect } from 'react';

function Login() {

    const handleCallbakResponse = (response) => {
        console.log("Encoded JWT ID token: " + response.credential)
    }

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: '346461362462-oufkqkoj5ao17di9j5r9tjvl8kp9aklf.apps.googleusercontent.com',
            callback: handleCallbakResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large"}
        )
      }, []);
    
    
      return (
        <div>
          <div id="signInDiv"></div>
        </div>
      );
}

export default Login
