import Nabvar from './components/Navbar'
import Home from './components/Home'
import CreateOld from './components/CreateOld'
import ShowPortfolio from './components/ShowPortfolio'
import NewPortfolio from './components/NewPortfolio'
import Footer from './components/Footer'
import AuthPage from './components/AuthPage';

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
          <Route path="/sign_in" element={<AuthPage/>}></Route>
        </Routes>
        <Footer/>
      </Router>
    </div>
  )
}

export default App
