import datetime as _dt
import sqlalchemy as _sql
import database as _database
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base


class Portfolio(_database.Base):
    __tablename__ = "portfolios"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    growth = _sql.Column(_sql.REAL)
    date_created = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now())
    date_updated = _sql.Column(_sql.DateTime, default=_dt.datetime.now(
    ), onupdate=_dt.datetime.now())
    user_id = _sql.Column(_sql.Integer, ForeignKey("users.id"), index=True)  # 追加
    
    user = relationship("User", backref="portfolios")  # Userモデルとのリレーション


class Ticker(_database.Base):
    __tablename__ = "tickers"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    portfolio_id = _sql.Column(
        _sql.Integer, ForeignKey("portfolios.id"), index=True)
    ticker = _sql.Column(_sql.String, nullable=False, index=True)
    ratio = _sql.Column(Integer, nullable=False)
    date_created = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now())
    date_updated = _sql.Column(_sql.DateTime, default=_dt.datetime.now(
    ), onupdate=_dt.datetime.now())

    Portfolio = relationship("Portfolio", backref="tickers")


class TickerMaster(Base):
    __tablename__ = "ticker_master"

    id = _sql.Column(Integer, primary_key=True, index=True)
    ticker = _sql.Column(String, nullable=False, index=True)
    exchange = _sql.Column(String, index=True)
    date_created = _sql.Column(_sql.DateTime, default=_dt.datetime.now())
    date_updated = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now(), onupdate=_dt.datetime.now())

    # リレーション
    prices = relationship("TickerPrice", back_populates="ticker_master")


class TickerPrice(Base):
    __tablename__ = "ticker_prices"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    ticker = _sql.Column(_sql.String, nullable=False, index=True)
    date = _sql.Column(_sql.Date, nullable=False, index=True)
    price = _sql.Column(_sql.Numeric(precision=8, scale=2), nullable=False)

    date_created = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now())
    date_updated = _sql.Column(_sql.DateTime, default=_dt.datetime.now(
    ), onupdate=_dt.datetime.now())

    # リレーション
    ticker_master_id = _sql.Column(_sql.Integer, _sql.ForeignKey(
        "ticker_master.id", ondelete="CASCADE"), index=True)
    ticker_master = relationship("TickerMaster", back_populates="prices")


class User(_database.Base):
    __tablename__ = "users"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    name = _sql.Column(_sql.String, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    avatar_url = _sql.Column(_sql.String)
    google_id = _sql.Column(_sql.String, unique=True, index=True)  # Googleから提供される固有のID
    # 必要に応じて、他のカラム（例: facebook_id）を追加できます。