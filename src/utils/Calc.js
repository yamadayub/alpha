export const calculateDifference = (portfolioData, primaryPortfolio) => {
    // Create an object mapping tickers to their ratios
    const portfolioDataMap = {};
    portfolioData.tickers.forEach(ticker => {
      portfolioDataMap[ticker.ticker] = ticker.ratio;
    });
  
    const primaryPortfolioMap = {};
    primaryPortfolio[0].tickers.forEach(ticker => {
      primaryPortfolioMap[ticker.ticker] = ticker.ratio;
    });
  
    // Calculate the differences
    const toBuy = [];
    const toSell = [];
  
    // Check tickers in portfolioData
    for (const ticker in portfolioDataMap) {
      const diff = portfolioDataMap[ticker] - (primaryPortfolioMap[ticker] || 0);
      if (diff > 0) {
        toBuy.push({ ticker, ratio: diff });
      } else if (diff < 0) {
        toSell.push({ ticker, ratio: -diff });
      }
    }
  
    // Check tickers in primaryPortfolio that were not in portfolioData
    for (const ticker in primaryPortfolioMap) {
      if (!portfolioDataMap.hasOwnProperty(ticker)) {
        toSell.push({ ticker, ratio: primaryPortfolioMap[ticker] });
      }
    }
  
    return { toBuy, toSell };
  };

