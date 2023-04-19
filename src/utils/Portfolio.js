import axios from 'axios';

export const getAllPortfolios = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    })
};

export const getOnePortfolio = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    })
};

export const createPortfolio = (url, tickers) => {
    console.log(tickers)
    return axios.post(url, { tickers: tickers })
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  export const getOnePortfolioPriceData = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    })
};