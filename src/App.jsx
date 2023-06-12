import Nabvar from './components/Navbar'
import Home from './components/Home'
import CreateOld from './components/CreateOld'
import ShowPortfolio from './components/ShowPortfolio'
import NewPortfolio from './components/NewPortfolio'
import Footer from './components/Footer'
import AuthPage from './components/AuthPage';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import MyPage from './components/MyPage'
import Comparison from './components/Comparison'
import { UserContext } from './utils/UserContext';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

const get_user_url = 'http://127.0.0.1:8000/user/me';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      console.log(token)
      const response = await fetch(get_user_url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response)

      if (response.ok) {
        const userData = await response.json();
        console.log("userData:", userData)
        setUser(userData);
      } else {
        console.error('Error fetching user data:', response.status, response.statusText);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ paddingBottom: '70px' }}>
      <Router>
        <UserContext.Provider value={{ user, setUser }}>
          <Nabvar/>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/new" element={<NewPortfolio/>}></Route>
            <Route path="/portfolio/:portfolio_id" element={<ShowPortfolio/>}></Route>
            <Route path="/auth" element={<AuthPage/>}></Route>
            <Route path="/sign_up" element={<SignUpPage/>}></Route>
            <Route path="/sign_in" element={<SignInPage/>}></Route>
            <Route path="/my_page" element={<MyPage/>}></Route>
            <Route path="/comparison/:portfolio_id" element={<Comparison/>}></Route>
          </Routes>
          <Footer/>
        </UserContext.Provider>
      </Router>
    </div>
  )
}

export default App
