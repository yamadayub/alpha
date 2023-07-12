import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getOnePortfolio, getOnePortfolioPriceData } from "../utils/Portfolio"
import Chart from "../utils/Chart"
import './Portfolio.css'
import { Link } from 'react-router-dom'
import DoughnutChart from "../utils/DoughnutChart"
import './Comparison.css'

const get_user_url = 'http://127.0.0.1:8000/user/me';

function ShowPortfolio() {
  const { portfolio_id } = useParams();
  let getOnePortfolioURL = `http://127.0.0.1:8000/portfolio/${portfolio_id}`
  let getOnePortfolioPriceDataURL = `http://127.0.0.1:8000/portfolio/${portfolio_id}/price_data`
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioPerformanceData, setPortfolioPerformanceData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [user, setUser] = useState(null);

  const chartBGColors = [
    'rgb(255, 26, 104, 0.1)',
    'rgb(54, 162, 235, 0.1)',
    'rgb(255, 206, 86, 0.1)',
    'rgb(75, 192, 192, 0.1)',
    'rgb(153, 102, 255, 0.1)',
    'rgb(255, 159, 64, 0.1)',
    'rgb(0, 0, 0, 0.2)'
    ];

const chartBorderColors = [
    'rgb(255, 26, 104, 1)',
    'rgb(54, 162, 235, 1)',
    'rgb(255, 206, 86, 1)',
    'rgb(75, 192, 192, 1)',
    'rgb(153, 102, 255, 1)',
    'rgb(255, 159, 64, 1)',
    'rgb(0, 0, 0, 1)'
    ];

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
            label: "Value Index",
            data: priceData.composite_price_by_date.map((data) => {
              return data.composite_price
            }),
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      };
      
      setChartData(tempChartData);



    }

    fetchData();
  },[getOnePortfolioURL, getOnePortfolioPriceDataURL])

  useEffect(() => {
    if (portfolioData) {
      const tempPieChartData = {
        labels: portfolioData.tickers.map(t => t.ticker),
        datasets: [{
            labels: portfolioData.tickers.map(t => t.ticker),
            data: portfolioData.tickers.map(t => t.ratio),
            backgroundColor: portfolioData.tickers.map((t, index) => chartBGColors[index % chartBGColors.length]),
            borderColor: portfolioData.tickers.map((t, index) => chartBorderColors[index % chartBorderColors.length]),
            hoverOffset: 4,
            borderWidth: 1
        }]
      };
      setPieChartData(tempPieChartData);
    }
  }, [portfolioData]);

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
            <tr className='portfolioPerformanceDetailTableHeader'>
              <th>Peak</th>
              <th>Trough</th>
              <th>Maximum Drowdown</th>
            </tr>
          </thead>
          <tbody>
            <tr className='portfolioPerformanceDetailTableBodyRow'>
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



      {user?
        <Link to={`/comparison/${portfolio_id}`}>
          <div className="compareButton">Compare with my portfolio</div>
        </Link>
        : 
        <></>
      }

      <div className="doughnutChartContainer">
        <div className="portfolioDounutChartBoxInPortfolioDetail">
          <DoughnutChart chartData={pieChartData} />
        </div>
      </div>
      <div className="portfolioDetailTickers">
        <table className='portfolioTickerTable'>
          <thead>
            <tr>
              <th>#</th>
              <th>Ticker</th>
              <th>Quantity</th>
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
    </div>
  )
}

export default ShowPortfolio
