import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getOnePortfolio, getOnePortfolioPriceData,getAllPortfoliosWithUserID } from "../utils/Portfolio"
import Chart from "../utils/Chart"
import { calculateDifference } from "../utils/Calc"
import './Portfolio.css'
import './Comparison.css'


function Comparison() {
    let get_user_url = 'http://127.0.0.1:8000/user/me';

    const {portfolio_id} = useParams();
    let getOnePortfolioURL = `http://127.0.0.1:8000/portfolio/${portfolio_id}`
    let getOnePortfolioPriceDataURL = `http://127.0.0.1:8000/portfolio/${portfolio_id}/price_data`
    let getMyPrimaryPortfolioPriceDataURL = null;
    
    const [portfolioData, setPortfolioData] = useState(null);
    const [portfolioPerformanceData, setPortfolioPerformanceData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [user, setUser] = useState(null);
    const [myPortfoliosData, setMyPortfoliosData] = useState([]);
    const [primaryPortfolio, setPrimaryPortfolio] = useState(null);
    const [comparisonChartData, setComparisonChartData] = useState(null);
    const [toBuy, setToBuy] = useState([]);
    const [toSell, setToSell] = useState([]);
    
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
            
            const fetchAllPortfolios = async () => {
                let getMyPortfoliosURL = `http://127.0.0.1:8000/portfolios/${userData.id}`;
                let res = await getAllPortfoliosWithUserID(getMyPortfoliosURL);
                console.log("Get my portfolios:",res)
                setMyPortfoliosData(res.portfolios);
                console.log("Updated myPortfoliosData:", res.portfolios);
                setPrimaryPortfolio(res.portfolios.filter(portfolio => portfolio.is_primary));
                console.log("My Primary Portfolio:",res.portfolios.filter(portfolio => portfolio.is_primary))
                let primary_portfolio_id = res.portfolios.filter(portfolio => portfolio.is_primary)[0].id
                getMyPrimaryPortfolioPriceDataURL = `http://127.0.0.1:8000/portfolio/${primary_portfolio_id}/price_data`
                console.log("Get myPortfoliosData URL:",getMyPrimaryPortfolioPriceDataURL)
            };
            fetchAllPortfolios();

            let priceData = await getOnePortfolioPriceData(getOnePortfolioPriceDataURL); 
            let myPrimaryPortfolioPriceData = await getOnePortfolioPriceData(getMyPrimaryPortfolioPriceDataURL);

            console.log("Target Portfolio Price Data:",priceData)
            console.log("My Portfolio Price Data:",myPrimaryPortfolioPriceData)

            const tempChartData = {
              labels: priceData.composite_price_by_date.map((data) => data.date),
              datasets: [
                {
                  label: `Target`,
                  data: priceData.composite_price_by_date.map((data) => {
                    return data.composite_price
                  }),
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)",
                  borderWidth: 2,
                  pointRadius: 0
                },
                {
                    label: "My Primary",
                    data: myPrimaryPortfolioPriceData.composite_price_by_date.map((data) => {
                      return data.composite_price
                    }),
                    backgroundColor: "rgba(75, 100, 192,0.2)",
                    borderColor: "rgba(75, 100, 192,1)",
                    borderWidth: 2,
                    pointRadius: 0
                },
              ]
            };
            
            setComparisonChartData(tempChartData);
        } else {
          console.error('Error fetching user data:', response.status, response.statusText);
        }
      };
  
      fetchUserData();
    }, []);

    useEffect(() => {
        if (portfolioData && primaryPortfolio) {
          const { toBuy, toSell } = calculateDifference(portfolioData, primaryPortfolio);
          setToBuy(toBuy);
          setToSell(toSell);
        }
      }, [portfolioData, primaryPortfolio]);
    
    if (!portfolioData || !primaryPortfolio) {
      return <div>Loading...</div>
    }
  
    return (
      <div className='portfolioDetailContainer'>

        {/* Performance Table */}
        <div className="portfolioDetailHeader">

          {(primaryPortfolio[0].latest_performance > portfolioPerformanceData.latest_performance)?
            (
              <div className='portfolioComparisonWin'>Win</div>
            )
          :
            (
              <div className='portfolioComparisonLose'>Lose</div>
            )
          }
          <table className='portfolioDetailGrowthTable'>
            <tbody>
              <tr>
                <td className='portfolioDetailGrowthHeader'>Target</td>
                <td className='portfolioDetailGrowthPerformance'>
                  {portfolioPerformanceData ? (
                    `${new Intl.NumberFormat('ja', 
                    {style: 'percent',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2}).format(portfolioPerformanceData.latest_performance)}`
                  ) : (
                    "Loading..."
                  )}
                </td>
              </tr>
              <tr>
                <td className='portfolioDetailGrowthHeader'>My Primary</td>
                <td className='portfolioDetailGrowthPerformance'>
                  {primaryPortfolio && console.log("PrimaryPortfolio:", primaryPortfolio)}
                  {primaryPortfolio ? (
                    `${new Intl.NumberFormat('ja', 
                    {style: 'percent',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2}).format(primaryPortfolio[0].latest_performance)}`
                  ) : (
                    "Loading..."
                  )}
                </td>
              </tr>
              <tr>
                <td className='portfolioDetailGrowthHeader'>Gap</td>
                <td className='portfolioDetailGrowthPerformance'>
                  {primaryPortfolio ? (
                    `${((primaryPortfolio[0].latest_performance - portfolioPerformanceData.latest_performance) * 100).toFixed(2)} pp`
                    // `${new Intl.NumberFormat('ja', 
                    // {style: 'percent',
                    // minimumFractionDigits: 2,
                    // maximumFractionDigits: 2}).format(primaryPortfolio[0].latest_performance - portfolioPerformanceData.latest_performance)}`
                  ) : (
                    "Loading..."
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Line Chart */}
        <div className="portfolioDetailChart">
            <Chart chartData={comparisonChartData} />
        </div>

        {/* Performance Comparison Table */}
        <div className="portfolioDetailPerformanceDetail">
            <div className="portfolioDetailPerformanceTitle">Details</div>
        <table className='portfolioPerformanceDetailTable'>
          <thead>
            <tr className='portfolioPerformanceDetailTableHeader'>
              <th>Portfolio</th>  
              <th>Peak</th>
              <th>Trough</th>
              <th>MDD</th>
            </tr>
          </thead>
          <tbody>
            <tr className='portfolioPerformanceDetailTableBodyRow'>
              <td><div className="portfolioName">Target</div></td>
              <td>
                <div className="portfolioPeak">
                {portfolioPerformanceData ? (
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(portfolioPerformanceData.peak)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
              <td><div className="portfolioTrough">
                {portfolioPerformanceData ? (
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(portfolioPerformanceData.trough)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
              <td><div className="portfolioMaxDrowDown">
                {portfolioPerformanceData ? (
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(portfolioPerformanceData.max_drow_down)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
            </tr>
            <tr className='portfolioPerformanceDetailTableBodyRow'>
              <td><div className="portfolioName">My Primary</div></td>
              <td>
                <div className="portfolioPeak">
                {portfolioPerformanceData ? (
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(primaryPortfolio[0].peak)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
              <td><div className="portfolioTrough">
                {portfolioPerformanceData ? (
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(primaryPortfolio[0].trough)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
              <td><div className="portfolioMaxDrowDown">
                {portfolioPerformanceData ? (
                  `${new Intl.NumberFormat('ja', {style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2}).format(primaryPortfolio[0].max_drow_down)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
            </tr>
            <tr className='portfolioPerformanceDetailTableBodyRow'>
              <td><div className="portfolioName">Gap</div></td>
              <td>
                <div className="portfolioPeak">
                {portfolioPerformanceData ? (
                  `${((primaryPortfolio[0].peak - portfolioPerformanceData.peak) * 100).toFixed(2)}pp`                  
                  // `${new Intl.NumberFormat('ja', {style: 'percent',
                  // minimumFractionDigits: 2,
                  // maximumFractionDigits: 2}).format(primaryPortfolio[0].peak - portfolioPerformanceData.peak)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
              <td><div className="portfolioTrough">
                {portfolioPerformanceData ? (
                  `${((primaryPortfolio[0].trough - portfolioPerformanceData.trough) * 100).toFixed(2)}pp`
                  // `${new Intl.NumberFormat('ja', {style: 'percent',
                  // minimumFractionDigits: 2,
                  // maximumFractionDigits: 2}).format(primaryPortfolio[0].trough - portfolioPerformanceData.trough)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
              <td><div className="portfolioMaxDrowDown">
                {portfolioPerformanceData ? (
                  `${((primaryPortfolio[0].max_drow_down - portfolioPerformanceData.max_drow_down) * 100).toFixed(2)}pp`
                  // `${new Intl.NumberFormat('ja', {style: 'percent',
                  // minimumFractionDigits: 2,
                  // maximumFractionDigits: 2}).format(primaryPortfolio[0].max_drow_down - portfolioPerformanceData.max_drow_down)}`
                ) : (
                  "Loading..."
                )}
              </div></td>
            </tr>
          </tbody>
        </table>     
      </div>

      <div className="actionsToCopyContainer">
        <div className="actionsToCopyTitle">To Copy This Portfolio</div>
          <div className="copyActionsTableContainer">
            <div className="tickersToBuy">
                <div className="tickersToBuyTitle">To Buy</div>
                    <div className="portfolioDetailTickersInComparison">
                        <table className='portfolioTickerTable'>
                        <thead>
                            <tr className='toSellBuyTickerTableHeader'>
                            <th>#</th>
                            <th>Ticker</th>
                            <th>Units</th>
                            </tr>
                        </thead>
                        <tbody>
                            {toBuy&&toBuy.map((item, index) => {
                            let count = index + 1;

                            return (
                                <tr key={index} className='toSellBuyTickerTableRaw'>
                                    <td>{index + 1}</td>
                                    <td>{item.ticker}</td>
                                    <td className='unitText'>
                                        +{Math.floor(item.ratio)}
                                    </td>
                                </tr>
                            );
                            })}
                        </tbody>
                        </table>
                    </div>
            </div>
            <div className="tickersToSell">
                <div className="tickersToSellTitle">To Sell</div>
                    <div className="portfolioDetailTickersInComparison">
                      <table className='portfolioTickerTable'>
                        <thead>
                            <tr className='toSellBuyTickerTableHeader'>
                            <th>#</th>
                            <th>Ticker</th>
                            <th>Units</th>
                            </tr>
                        </thead>
                        <tbody>
                            {toSell&&toSell.map((item, index) => {
                            let count = index + 1;

                            return (
                                <tr key={index} className='toSellBuyTickerTableRaw'>
                                    <td>{index + 1}</td>
                                    <td>{item.ticker}</td>
                                    <td className='unitText'>
                                        -{Math.floor(item.ratio)}
                                    </td>
                                </tr>
                            );
                            })}
                        </tbody>
                      </table>
                    </div>
              </div>
          </div>
        </div>
      </div>
    )
}

export default Comparison
