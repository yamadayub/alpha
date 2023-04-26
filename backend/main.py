import uvicorn
from sqlalchemy.orm import Session
from typing import Annotated
from jose import jwt, JWTError
import os
from datetime import datetime as _dt, timedelta
from passlib.context import CryptContext
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


import schemas
import crud
import models
import utils

from database import SessionLocal, engine
import logging

# ENVファイルからの環境変数読み込み
load_dotenv()

# パスワードのハッシュ化関数を定義
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# DBの作成
models.Base.metadata.create_all(bind=engine)


app = FastAPI()


# CORS関連設定
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

# 環境変数設定
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# DBセッションの作成


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


@app.get("/portfolios/{user_id}")
async def get_portfolios_by_user_id(user_id: int, db: Session = Depends(get_db)):
    return await utils.getPortfolioByUserId(db=db, user_id=user_id)


@app.get("/ticker_list")
async def get_ticker_master(db: Session = Depends(get_db)):
    return await utils.getTickerMaster(db=db)


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = _dt.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = await crud.get_user_by_username(db, username=user.username)
    print(f"db_user: {db_user}")
    if db_user:
        raise HTTPException(status_code=400, detail="Username already in use")
    db_user = await crud.create_user(db=db, user=user)
    return schemas.User.from_orm(db_user)  # この行を追加


@app.post("/token", response_model=schemas.Token)
async def login(form_data: schemas.LoginForm, db: Session = Depends(get_db)):
    user = await crud.get_user_by_username(db, username=form_data.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    if not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
