from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer

import schemas
import crud
import models
import utils

from database import SessionLocal, engine
import logging


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:5173/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def Hello():
    return {"Hello": "World!"}


@app.get("/portfolios")
async def get_all_portfolios(db: Session = Depends(get_db)):
    return await crud.get_all_portfolios(db=db)


@app.get("/portfolio/{portfolio_id}", response_model=schemas.PortfolioDetail)
async def get_portfolio_by_id(portfolio_id: int, db: Session = Depends(get_db)):
    return await crud.get_portfolio(db=db, portfolio_id=portfolio_id)


@app.post("/portfolio")
async def post_portfolio(portfolio: schemas.PortfolioDetailCreate, db: Session = Depends(get_db)):
    data = portfolio.json()
    print(data)
    return await crud.create_portfolio(db=db, portfolio=portfolio)


@app.put("/portfolio/{id}")
async def put_portfolio(id, portfolio):
    return 1


@app.delete("/portfolio/{id}")
async def delete_portfolio(id):
    return 1


@app.get("/portfolio/{portfolio_id}/price_data", response_model=schemas.PortfolioCompositePriceByDate)
async def get_portfolio_price_data_by_id(portfolio_id: int, db: Session = Depends(get_db)):
    return await utils.getPriceData(db=db, portfolio_id=portfolio_id)


@app.get("/ticker_list")
async def get_ticker_master(db: Session = Depends(get_db)):
    return await utils.getTickerMaster(db=db)


@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
