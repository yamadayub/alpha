from sqlalchemy.orm import Session
from passlib.context import CryptContext

import models
import schemas
from sqlalchemy import desc
from sqlalchemy.orm import joinedload
import utils
import hashlib

# パスワードのハッシュ化と検証用のオブジェクトを作成
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


async def get_portfolio(db: Session, portfolio_id: int):
    result = db.query(models.Portfolio).options(joinedload(
        models.Portfolio.tickers)).filter(models.Portfolio.id == portfolio_id).first()

    # growthを上書き
    result.growth = utils.setGrowth(result)
    portfolio_detail = schemas.PortfolioDetail.from_orm(result)

    return portfolio_detail


async def get_all_portfolios(db: Session):
    result = db.query(models.Portfolio).options(
        joinedload(models.Portfolio.tickers)).all()

    portfolios_detail = []
    for portfolio in result:
        tickers = []
        for ticker in portfolio.tickers:
            ticker_detail = models.Ticker(id=ticker.id, portfolio_id=ticker.portfolio_id,
                                          ticker=ticker.ticker, ratio=ticker.ratio, date_created=ticker.date_created)
            tickers.append(ticker_detail)

         # ratioで降順にソートして上位3つを取得する
        sorted_tickers = sorted(tickers, key=lambda x: x.ratio, reverse=True)
        top_3_tickers = sorted_tickers[:3]

        portfolio_detail = models.Portfolio(
            id=portfolio.id, growth=portfolio.growth, date_created=portfolio.date_created, tickers=top_3_tickers)

        # growthを上書き
        portfolio_detail.growth = utils.setGrowth(portfolio_detail)

        # latest_performance, peak, trough, MDDを上書き
        portfolo_performance_detail = await utils.getPriceData(db, portfolio.id)

        portfolio_detail.latest_performance = portfolo_performance_detail.latest_performance
        portfolio_detail.peak = portfolo_performance_detail.peak
        portfolio_detail.trough = portfolo_performance_detail.trough
        portfolio_detail.max_drow_down = portfolo_performance_detail.max_drow_down

        portfolios_detail.append(portfolio_detail)

    all_portfolios_detail = schemas.AllPortfoliosDetail(
        portfolios=portfolios_detail)

    return all_portfolios_detail


async def create_portfolio(db: Session, portfolio: schemas.PortfolioDetailCreate):

    # insert portfolio
    db_portfolio = models.Portfolio(growth=0.1, user_id=portfolio.user_id)
    db.add(db_portfolio)
    db.flush()  # データベースに保存してidを発行する

    # insert tickers
    for ticker in portfolio.tickers:
        db_ticker = models.Ticker(
            ticker=ticker.ticker, ratio=ticker.ratio, portfolio_id=db_portfolio.id
        )
        db.add(db_ticker)

    # commit
    db.commit()

    result = db.query(models.Portfolio).options(
        joinedload(models.Portfolio.tickers)).order_by(desc(models.Portfolio.id)).first()

    print(result.id)
    return result.id


async def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        email=user.email, username=user.username, hashed_password=hashed_password, avatar_url=user.avatar_url, google_id=user.google_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
