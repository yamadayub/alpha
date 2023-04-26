import Nabvar from './components/Navbar'
import Home from './components/Home'
import CreateOld from './components/CreateOld'
import ShowPortfolio from './components/ShowPortfolio'
import NewPortfolio from './components/NewPortfolio'
import Footer from './components/Footer'
import Login from './components/Login';

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
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
        <Footer/>
      </Router>
    </div>
  )
}

export default App
