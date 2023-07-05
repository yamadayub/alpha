import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom"
import { getOnePortfolioPriceData } from "../utils/Portfolio"
import DoughnutChart from "../utils/DoughnutChart"
import SimpleChart from "../utils/SimpleChart"
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import './Portfolio.css'

function PortfolioCardForMyPage({ portfolio, index, primary, setPrimary }) {
    // console.log(setPrimary);
    let getOnePortfolioPriceDataURL = `http://127.0.0.1:8000/portfolio/${portfolio.id}/price_data`
    const [portfolioPerformanceData, setPortfolioPerformanceData] = useState(null);
    const [lineChartData, setLineChartData] = useState(null);
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
                pointRadius: 0
                }
            ]
            };
            setLineChartData(tempChartData);
        }
    fetchData();
    
    // ratioでソート
    portfolio.tickers.sort((a, b) => b.ratio - a.ratio);

    },[getOnePortfolioPriceDataURL])



const pieChartData = {
    labels: portfolio.tickers.map(t => t.ticker),
    datasets: [{
        labels: portfolio.tickers.map(t => t.ticker),
        data: portfolio.tickers.map(t => t.ratio),
        backgroundColor: portfolio.tickers.map((t, index) => chartBGColors[index % chartBGColors.length]),
        borderColor: portfolio.tickers.map((t, index) => chartBorderColors[index % chartBorderColors.length]),
        hoverOffset: 4,
        borderWidth: 1
    }]
    };

  return (
    <div>
            <div key={index} className='portfolioCard'>
 
            <div className='cardHeader'>
              {primary? 
                <div className='portfolioPrimaryTagPrimary'>Primary</div>
                :
                <button 
                    type="button" 
                    className="setPrimaryPortfolioButton"
                    id={`setPrimaryPortfolioButton/${portfolio.id}`}
                    onClick={(event) => setPrimary(portfolio.id, event)}
                >
                Set Primary
                </button>
              }
              {/* <div className='portfolioRank'>{index + 1}</div> */}
              {/* <div className='portfolioName'>Portfolio Name</div> */}
              {/* <div className='pmName'>Created by XXX</div> */}
              <Link to={`/portfolio/${portfolio.id}`} className='portfolioLink'>
                <div className='portfoliId'>Detail <ArrowCircleRightOutlinedIcon/></div>
              </Link>
            </div>


            <div className="portfolio_detail">     
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

                    <div className="portfolioDetailChartHome">
                        <SimpleChart chartData={lineChartData} uniqueKey={index}/>
                    </div>
                </div>

                <div className="portfolioDounutChartBox">
                    <DoughnutChart chartData={pieChartData} />
                </div>
            </div>
          </div>
    </div>
  )
}

export default PortfolioCardForMyPage
