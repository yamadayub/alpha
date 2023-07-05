import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { getAllPortfoliosWithUserID, setPrimaryPortfolio } from "../utils/Portfolio"
import './Portfolio.css'
import './MyPage.css'
import PortfolioCardForMyPage from './PortfolioCardForMyPage';

const get_user_url = 'http://127.0.0.1:8000/user/me';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [myPortfoliosData, setMyPortfoliosData] = useState([]);
  const [primaryPortfolios, setPrimaryPortfolios] = useState([]);
  const [otherPortfolios, setOtherPortfolios] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      // console.log(token)
      const response = await fetch(get_user_url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      // console.log(response)

      if (response.ok) {
        const userData = await response.json();
        // console.log("userData:", userData)
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
      // console.log(res)
      setMyPortfoliosData(res.portfolios);
    };
    fetchAllPortfolios();
  }, [user]);

  useEffect(() => {
    // console.log("Updated myPortfoliosData:", myPortfoliosData);
    // console.log(myPortfoliosData.length);
    // console.log(portfolio);
    console.log(myPortfoliosData.filter(portfolio => portfolio.is_primary));
    console.log(myPortfoliosData.filter(portfolio => !portfolio.is_primary));
    setPrimaryPortfolios(myPortfoliosData.filter(portfolio => portfolio.is_primary));
    setOtherPortfolios(myPortfoliosData.filter(portfolio => !portfolio.is_primary));
  }, [myPortfoliosData]);

  const setPrimary = async (portfolio_id, event) => {
    // console.log(">>>>> Set Primary Button Clicked! <<<<<");
    let setPrimaryPortfolioURL = `http://127.0.0.1:8000/portfolio/${portfolio_id}/primary/${user.id}`;
    // console.log(setPrimaryPortfolioURL);
    let res = await setPrimaryPortfolio(setPrimaryPortfolioURL);
    // console.log(res)
    setMyPortfoliosData(res.portfolios);
  };

  if (!user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6">Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <div className='myPageContainer'>
      <div className="myPageAccountInfo">
        <div className="myPageAvator">
          <SentimentSatisfiedAltIcon className='myPageAvator'/>
        </div>
        <div className="myPageAccountDetail">
          <div className="myPageUserId">ID: {user.id}</div>
          <div className="myPageEmail">Email: {user.email}</div>
        </div>
      </div>


      <div className='portfolioCardContainer'>
      {primaryPortfolios.length > 0 && primaryPortfolios.map((portfolio, index) => {
        console.log("Attaching event handler to button for Primary Portfolio ID:", portfolio.id);
        return (
          <PortfolioCardForMyPage portfolio={portfolio} index={index} primary={true} />
        );
      })}

      {otherPortfolios.length > 0 && otherPortfolios.map((portfolio, index) => {
        console.log("Attaching event handler to button for other portfolio ID:", portfolio.id);
        return (
          <PortfolioCardForMyPage portfolio={portfolio} index={index} primary={false} setPrimary={setPrimary} />
            );
          })}
        </div>
    </div>
  );
  // console.log("Testing setPrimaryPortfolio...");
  setPrimaryPortfolio("test", {});
};

export default MyPage;