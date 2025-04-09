import yfinance as yf

def hello(stock):
    return stock


def get_stock_search(symbol):
    return yf.Ticker(symbol).info['open']



# def get_stock_search(stock):
#     return stock

