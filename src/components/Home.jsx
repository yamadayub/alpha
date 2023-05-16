import React, { useEffect, useState } from 'react'
// import { portfolioCards } from "./Portfolio"
import { Link } from "react-router-dom"
import { getAllPortfolios } from "../utils/Portfolio"
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import './Portfolio.css'


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
          <div key={index} className='portfolioCard'>
            <div className='cardHeader'>
              <div className='portfolioRank'>{index + 1}</div>
              <Link to={`/portfolio/${portfolio.id}`} className='portfolioLink'>
                <div className='portfoliId'>Detail <ArrowCircleRightOutlinedIcon/></div>
              </Link>
            </div>
            <div className="portfolio_detail">
              <div className='portfolioTickers'>
                <table className='portfolioTickerTable'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Ticker</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.tickers.map((ticker, ticker_index) => {
                      let count = ticker_index + 1;

                      return (
                        <tr key={ticker_index}>
                          <td>{ticker_index + 1}</td>
                          <td>{ticker.ticker}</td>
                          <td className='ratioText'>
                            {Math.floor(ticker.ratio)}
                          </td>
                        </tr>
                      );
                    })}
                    {(portfolio.tickers.length <= 3) && Array(3 - portfolio.tickers.length)
                      .fill(null)
                      .map((_, index) => {
                        // カウンタ変数をインクリメント
                        let count = index + 1 + portfolio.tickers.length;

                        return (
                          <tr key={`na-${index}`}>
                            <td>{count}</td>
                            <td className='na_text'>N/A</td>
                            <td className='na_text'>N/A</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>                
              </div>
              
              <div className="portfolio_performance">
                <div className='portfolioGrowth'>
                  <table className='portfolioGrowthTable'>
                    <tbody>
                      <tr>
                            <td className='growthHeader'>YTD</td>
                            <td className='ytdPerformance'>{new Intl.NumberFormat('ja', 
                            {style: 'percent',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2}).format(portfolio.latest_performance)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="portfolioPerformanceDetail">
                <table className='portfolioPerformanceDetailTable'>
                  <thead>
                    <tr>
                      <th>Peak</th>
                      <th>Trough</th>
                      <th>MDD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="portfolioPeak">
                          {new Intl.NumberFormat('ja', 
                                {style: 'percent',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2}).format(portfolio.peak)
                          }
                          </div>
                        </td>
                      <td>
                        <div className="portfolioTrough">
                          {new Intl.NumberFormat('ja', 
                                {style: 'percent',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2}).format(portfolio.trough)
                          }
                        </div>
                      </td>
                      <td>
                        <div className="portfolioMaxDrowDown">
                          {new Intl.NumberFormat('ja', 
                                {style: 'percent',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2}).format(portfolio.max_drow_down)
                          }
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>                
                </div>
              </div>
            </div>
          </div>
        )
    })}
    </div>
  )

}

export default Home
