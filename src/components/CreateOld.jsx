import React, { useState, useEffect } from 'react'
import uuid from "react-uuid"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { createPortfolio } from '../utils/Portfolio';
import { useNavigate } from 'react-router-dom';
import "./Create.css"

function CreateOld() {
  const [tickers, setTickers] = useState([{id: uuid(), ticker: "", ratio: ""}]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    onUpdateTicker({
      ...ticker,
      [key]: value,
    })
  };

  const clickHandlerA = () => {
    console.log('Clicked Button-A');
  };

  const clickHandlerB = () => {
    console.log('Clicked Button-B');
  };

  const clickHandlerC = () => {
    console.log('Clicked Button-C');
  };

  const clickHandlerD = () => {
    console.log('Clicked Button-D');
  };

  // const newPortfolio = async (event) => {
  //   event.preventDefault();
  //   console.log('Button clicked');
  //   console.log("trying post a new portfolio");
  //   console.log(tickers);

  //   try {
  //     const url = 'http://127.0.0.1:8000/portfolio';
      
  //     const tickers_wo_id = tickers.map(({ id, ...rest }) => rest);
  //     const response = await createPortfolio(url, tickers_wo_id);
  //     setSuccessMessage('Portfolio created successfully!');
  //     setErrorMessage('');
  //     navigate(`/portfolio/${response}`);
  //     console.log(successMessage);

  //   } catch (error) {
  //     setErrorMessage(error.message);
  //     setSuccessMessage('');
  //   }
  // };

  return (
    <div>
      <div>

        <div>
          <button type="button" className='createButton' id="button-A" onClick={clickHandlerA}>
            Button-A
          </button>
        </div>

        <div>
          {errorMessage && <div className='error-message'>{errorMessage}</div>}
        </div>

        <div>
        {tickers.map((ticker,index)=>(

            <div className="tickerContainer" key={ticker.id} id={ticker.id}>
              <div className="inputPortfolio">
                <div>Ticker</div>
                <input type="text" placeholder='Ticker' value={ticker.ticker} onChange={(e) => onEditTicker(ticker, "ticker", e.target.value)}/>
              </div>
              <div className="inputPortfolio">
                <div>Unit/Unit Ratio</div>
                  <input type="text" placeholder='Unit/Unit Ratio'  value={ticker.ratio} onChange={(e) => onEditTicker(ticker, "ratio", e.target.value)}/>
              </div>
            </div>
          
          ))}
        </div>

        <div className="addTickerButton">
        <button type="button" className='createTickerButton' id="addTickerButton" onClick={addTicker}>
          <FontAwesomeIcon icon={faSquarePlus} />Button-B
        </button>
      </div>
      <div>
        <button type="button" className='createButton' id="button-B" onClick={clickHandlerC}>
          Button-C
        </button>
      </div>
      </div>

      <div className="createPortfolioButton">
        <button type="button" className='createButton'  id="createPortfolioButton" onClick={clickHandlerD}>
          Button-D
        </button>
      </div>
    </div>
  )
}

export default CreateOld
