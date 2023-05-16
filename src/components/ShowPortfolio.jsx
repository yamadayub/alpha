import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getOnePortfolio, getOnePortfolioPriceData } from "../utils/Portfolio"
import Chart from "../utils/Chart"
import './Portfolio.css'
import chart from '../assets/chart.jpg'; 
import pie_chart from '../assets/pie_chart.jpeg'; 
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom'

const get_user_url = 'http://127.0.0.1:8000/user/me';

function ShowPortfolio() {
  const { portfolio_id } = useParams();
  let getOnePortfolioURL = `http://127.0.0.1:8000/portfolio/${portfolio_id}`
  let getOnePortfolioPriceDataURL = `http://127.0.0.1:8000/portfolio/${portfolio_id}/price_data`
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioPerformanceData, setPortfolioPerformanceData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(()=>{   
    const fetchData = async () => {
      let portfolio_data = await getOnePortfolio(getOnePortfolioURL);  
      setPortfolioData(portfolio_data)

      let priceData = await getOnePortfolioPriceData(getOnePortfolioPriceDataURL); 
      setPortfolioPerformanceData(priceData);

      const tempChartData = {
        labels: priceData.composite_price_by_date.map((data) => data.date),
        datasets: [
          {
            label: "Composite Price",
            data: priceData.composite_price_by_date.map((data) => {
              return data.composite_price
            }),
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
          }
        ]
      };
      
      setChartData(tempChartData);
    }

    fetchData();
  },[getOnePortfolioURL, getOnePortfolioPriceDataURL])

  useEffect(() => {
    if (portfolioPerformanceData) {
      console.log(portfolioPerformanceData);
    }
  }, [portfolioPerformanceData]);

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

  if (!portfolioData) {
    return <div>Loading...</div>
  }

  return (
    <div className='portfolioDetailContainer'>
      <div className="portfolioDetailHeader">
        <div className='portfolioDetailRank'>{portfolio_id}</div>
        <table className='portfolioDetailGrowthTable'>
          <tbody>
            <tr>
              <td className='portfolioDetailGrowthHeader'>YTD</td>
              <td className='portfolioDetailGrowthPerformance'>
                {/* {new Intl.NumberFormat('ja', {style: 'percent'}).format(portfolioData.growth)} */}
                {portfolioPerformanceData ? (
              // Replace 'YOUR_FIELD' with the actual field name from portfolioPerformanceData you want to display
                  `${new Intl.NumberFormat('ja', 
                  {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(portfolioPerformanceData.latest_performance)}`
                ) : (
                  // Display a loading indicator or a default value while waiting for the data
                  "Loading..."
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="portfolioDetailChart">
        {/* <img src={chart} alt="chart image" className="chartImage" /> */}
        <Chart chartData={chartData} />
      </div>

      <div className="portfolioDetailPerformanceDetail">
        <table className='portfolioPerformanceDetailTable'>
          <thead>
            <tr>
              <th>Peak</th>
              <th>Trough</th>
              <th>Max Drowdown</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><div className="portfolioPeak">
                {portfolioPerformanceData ? (
              // Replace 'YOUR_FIELD' with the actual field name from portfolioPerformanceData you want to display
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(portfolioPerformanceData.peak)}`
                ) : (
                  // Display a loading indicator or a default value while waiting for the data
                  "Loading..."
                )}
              </div></td>
              <td><div className="portfolioTrough">
                {portfolioPerformanceData ? (
                // Replace 'YOUR_FIELD' with the actual field name from portfolioPerformanceData you want to display
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(portfolioPerformanceData.trough)}`
                ) : (
                  // Display a loading indicator or a default value while waiting for the data
                  "Loading..."
                )}
              </div></td>
              <td><div className="portfolioMaxDrowDown">
                {portfolioPerformanceData ? (
                // Replace 'YOUR_FIELD' with the actual field name from portfolioPerformanceData you want to display
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(portfolioPerformanceData.max_drow_down)}`
                ) : (
                  // Display a loading indicator or a default value while waiting for the data
                  "Loading..."
                )}
              </div></td>
            </tr>
          </tbody>
        </table>     
      </div>

      <div className="portfolioDetailTickers">
        <table className='portfolioTickerTable'>
          <thead>
            <tr>
              <th>#</th>
              <th>Ticker</th>
              <th>Ratio</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.tickers.map((ticker, ticker_index) => {
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
          </tbody>
        </table>
      </div>

      {user?
        <Link to={`/comparison/${portfolio_id}`}>
          <div className="compareButton">Compare with my portfolio</div>
        </Link>
        : 
        <></>
      }

    </div>
  )
}

export default ShowPortfolio
