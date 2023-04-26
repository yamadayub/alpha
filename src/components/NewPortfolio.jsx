import React, { useState, useEffect } from 'react'
import uuid from "react-uuid"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { createPortfolio } from '../utils/Portfolio';
import { useNavigate } from 'react-router-dom';
import "./NewPortfolio.css"

function NewPortfolio() {
  const [tickers, setTickers] = useState([{id: uuid(), ticker: "", ratio: ""}]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [availableTickers, setAvailableTickers] = useState([]);
  const [inputText, setInputText] = useState(''); // 追加
  const navigate = useNavigate();

  // TickerMasterからtickersリストを取得する関数
  const fetchTickers = async () => {
    try {
      const getTickerMasterURL = 'http://127.0.0.1:8000/ticker_list';
      const response = await fetch(getTickerMasterURL);
      const data = await response.json();
      setAvailableTickers(data.tickers);
      console.log(availableTickers);
    } catch (error) {
      console.error('Error fetching tickers:', error);
    }
  };

  // コンポーネントがマウントされた時にfetchTickersを呼び出す
  useEffect(() => {
    fetchTickers();
  }, []);

  const addTicker = () => {
    console.log("add ticker pressed")
    const newTicker = {
      id: uuid(),
      ticker: "",
      ratio: "",
    }
    setTickers([...tickers, newTicker])
    console.log(tickers);
  }

  // 入力されたテキストに基づいて候補のリストをフィルタリングする関数
  const filterTickers = (text) => {
    if (!text) return [];
    return availableTickers.filter(ticker => ticker.toLowerCase().startsWith(text.toLowerCase()));
  };
  
  const onUpdateTicker = (updatedTicker) => {
    const updatedTickersArray = tickers.map((ticker) => {
      if (ticker.id === updatedTicker.id){
        return updatedTicker;
      } else {
        return ticker;
      }
    });
    setTickers(updatedTickersArray);
  }

  const onEditTicker = (ticker, key, value) => {
    setInputText(value); // 追加
    onUpdateTicker({
      ...ticker,
      [key]: value,
    })
  };

  const handleSuggestionClick = (ticker, suggestion) => {
    onEditTicker(ticker, 'ticker', suggestion);
    setInputText(''); // プルダウンリストのtickerが選択された後にinputTextを空にする
  };
  
  const clickHandlerA = () => {
    console.log('Clicked Button-A');
  };

  const newPortfolio = async (event) => {
    event.preventDefault();
    console.log('Button clicked');
    console.log("trying post a new portfolio");
    console.log(tickers);

    // 入力されたtickerがTickerMasterに含まれているかどうかをチェック
    const invalidTickers = tickers.filter(ticker => !availableTickers.includes(ticker.ticker));

    if (invalidTickers.length > 0) {
      // 一つでも存在しないtickerがあればエラーメッセージを表示
      const invalidTickersString = invalidTickers.map(t => t.ticker).join(', ');
      setErrorMessage(`${invalidTickersString} is not available as a ticker`);
      return;
    }

    try {
      const url = 'http://127.0.0.1:8000/portfolio';
      
      const tickers_wo_id = tickers.map(({ id, ...rest }) => rest);
      const response = await createPortfolio(url, tickers_wo_id);
      setSuccessMessage('Portfolio created successfully!');
      setErrorMessage('');
      navigate(`/portfolio/${response}`);
      console.log(successMessage);

    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className='newPortfolio'>
      <div className='newPortfolioContainer'>

        <div className='dummyButton'>
          <button type="button" className='createButton' id="button-A" onClick={clickHandlerA} disabled>
            Dummy Button
          </button>
        </div>        

        <div>
          {errorMessage && <div className='error-message'>{errorMessage}</div>}
        </div>

        <div className='portfolioContainer'>
        {tickers.map((ticker,index)=>(

            <div className="tickerContainer" key={ticker.id} id={ticker.id}>
              <div className="inputPortfolio">
                <div>Ticker</div>
                <input type="text" placeholder='Ticker' value={ticker.ticker} onChange={(e) => onEditTicker(ticker, "ticker", e.target.value)}/>
                  {/* プルダウン表示 */}
                  {inputText.length > 0 && (
                    <div className="ticker-dropdown">
                      {filterTickers(inputText).map(suggestion => (
                        <div key={suggestion} onClick={() => handleSuggestionClick(ticker, suggestion)} className="ticker-dropdown-item">
                        {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <div className="inputPortfolio">
                <div>Unit</div>
                  <input type="text" placeholder='Unit/Unit Ratio'  value={ticker.ratio} onChange={(e) => onEditTicker(ticker, "ratio", e.target.value)}/>
              </div>
            </div>
          
          ))}
        </div>

        <div className="addTickerButton">
          <button type="button" className='createButton' id="addTickerButton" onClick={addTicker}>
            <FontAwesomeIcon icon={faSquarePlus} /> Add A Ticker
          </button>
        </div>

        {/* <div>
          <button type="button" className='createButton' id="button-B" onClick={clickHandlerC}>
            Button-C
          </button>
        </div> */}
      </div>

      <div className="createPortfolioAction">
        <button type="button" className='createPortfolioButton'  id="createPortfolioButton" onClick={newPortfolio}>
          Create A New Portfolio
        </button>
      </div>
    </div>
  )
}

export default NewPortfolio
