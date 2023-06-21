import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { getAllPortfolios } from "../utils/Portfolio"
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import './Portfolio.css'
import PortfolioCard from "./PortfolioCard";


function Home() {
  const [portfoliosData, setPortfoliosData] = useState([]);

  let getPortfoliosURL = "http://127.0.0.1:8000/portfolios"

  useEffect(()=>{
    const fetchAllPortfolios = async () => {
      let res = await getAllPortfolios(getPortfoliosURL);  
      setPortfoliosData(res.portfolios)
    }
    fetchAllPortfolios();
  },[])

  const sortedPortfolios = portfoliosData.sort((a,b) => b.growth - a.growth)

  return (
    <div className='portfolioCardContainer'>
      {sortedPortfolios.map((portfolio, index) => {
        return (
          <PortfolioCard portfolio={portfolio} index={index} />
        )
    })}
    </div>
  )

}

export default Home
