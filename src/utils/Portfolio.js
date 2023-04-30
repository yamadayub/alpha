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

export const createPortfolio = (url, tickers, user_id) => {
    console.log("Sending request to:", url);
    console.log("Payload:", { tickers, user_id });
    
    const payload = {
        tickers: tickers,
        user_id: user_id
      };
    return axios.post(url, payload)
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