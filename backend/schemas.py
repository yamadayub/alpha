import datetime as _dt
import pydantic as _pydantic
from typing import List


class _BasePortfolio(_pydantic.BaseModel):
    growth: float = 0


class Portfolio(_BasePortfolio):
    id: int = 0
    date_created: _dt.datetime = _dt.datetime.now()

    class Config:
        orm_mode = True


class CreatePortfolio(_BasePortfolio):
    pass


class _BaseTicker(_pydantic.BaseModel):
    ticker: str
    ratio: float


class Ticker(_BaseTicker):
    portfolio_id: int
    id: int
    date_created: _dt.datetime

    class Config:
        orm_mode = True


class PortfolioDetail(_pydantic.BaseModel):
    id: int = 0
    growth: float = 0
    latest_performance: float = 0.123
    peak: float = 0.234
    trough: float = -0.123
    max_drow_down: float = -0.234
    tickers: List[Ticker] = []

    class Config:
        orm_mode = True


class AllPortfoliosDetail(_pydantic.BaseModel):
    portfolios: List[PortfolioDetail] = []

    class Config:
        orm_mode = True


class PortfolioDetailCreate(_pydantic.BaseModel):
    tickers: List[_BaseTicker]

    class Config:
        orm_mode = True


class CreateTicker(_BaseTicker):
    pass


class TickerPriceModel(_pydantic.BaseModel):
    ticker: str
    ratio: float
    price: float


class DatePricesModel(_pydantic.BaseModel):
    date: _dt.datetime
    ticker_prices: List[TickerPriceModel]


class PortfolioPriceData(_pydantic.BaseModel):
    date_prices: List[DatePricesModel]


class CompositePriceByDate(_pydantic.BaseModel):
    date: _dt.datetime
    composite_price: float


class PortfolioCompositePriceByDate(_pydantic.BaseModel):
    composite_price_by_date: List[CompositePriceByDate]
    latest_performance: float = 0.123
    peak: float = 0.234
    trough: float = -0.123
    max_drow_down: float = -0.234


class TickerMaster(_pydantic.BaseModel):
    tickers: List

    class Config:
        orm_mode = True
