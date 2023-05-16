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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"


function App() {  
  return (
    <div style={{ paddingBottom: '70px' }}>
      <Router>
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
      </Router>
    </div>
  )
}

export default App
