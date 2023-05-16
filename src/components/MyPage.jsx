import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import { getAllPortfoliosWithUserID } from "../utils/Portfolio"
import { Link } from "react-router-dom"
import './Portfolio.css'
import './MyPage.css'

const get_user_url = 'http://127.0.0.1:8000/user/me';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [myPortfoliosData, setMyPortfoliosData] = useState([]);
  const [primaryPortfolios, setPrimaryPortfolios] = useState([]);
  const [otherPortfolios, setOtherPortfolios] = useState([]);

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


  useEffect(() => {
    if (!user) {
      return;
    }

    let getMyPortfoliosURL = `http://127.0.0.1:8000/portfolios/${user.id}`;
    const fetchAllPortfolios = async () => {
      let res = await getAllPortfoliosWithUserID(getMyPortfoliosURL);
      console.log(res)
      setMyPortfoliosData(res.portfolios);
    };
    fetchAllPortfolios();
  }, [user]);

  useEffect(() => {
    console.log("Updated myPortfoliosData:", myPortfoliosData);
    console.log(myPortfoliosData.length);
    setPrimaryPortfolios(myPortfoliosData.filter(portfolio => portfolio.is_primary));
    setOtherPortfolios(myPortfoliosData.filter(portfolio => !portfolio.is_primary));
  }, [myPortfoliosData]);

  const setPrimaryPortfolio = (portfolio_id, event) => {
    console.log(">>>>> Set Primary Button Clicked! <<<<<");
  };

  if (!user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="20vh"
      >
        <Typography variant="h6">Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <div className='myPageContainer'>
      <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="10vh"
      >
        <Typography variant="h6">ID: {user.id} Email: {user.email}</Typography>
        <Box mt={2}>
          <Avatar src={user.avatar_url} alt="User Avatar" />
        </Box>
      </Box>

      <div className='portfolioCardContainer'>
      {primaryPortfolios.length > 0 && primaryPortfolios.map((portfolio, index) => {
        console.log("Attaching event handler to button for Primary Portfolio ID:", portfolio.id);
        return (
          <div key='primary' className='primaryPortfolioCard'>
            <div className='cardHeader'>
                <div className='portfolioPrimaryTagPrimary'>Primary</div>
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
                      <th>Ratio</th>
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
        );
      })}

      {otherPortfolios.length > 0 && otherPortfolios.map((portfolio, index) => {
        console.log("Attaching event handler to button for other portfolio ID:", portfolio.id);
        return (
          <div key={index} className='otherPortfolioCard'>
            <div className='cardHeader'>
              <div
                className="setPrimaryPortfolioButton"
                id="setPrimaryPortfolioButtonID"
                onClick={(event) => setPrimaryPortfolio(portfolio.id, event)}
              >
                Make This Primary
              </div>

             
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
                      <th>Ratio</th>
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
            );
          })}
        </div>
    </div>
  );
  console.log("Testing setPrimaryPortfolio...");
  setPrimaryPortfolio("test", {});
};

export default MyPage;