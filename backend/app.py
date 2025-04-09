from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import yfinance as yf
import json
import pandas as pd
import test  # Import test.py instead of app
import requests
import random
from datetime import datetime, timedelta

end_date = datetime.now().strftime("%Y-%m-%d")


app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/message', methods=['GET'])
def get_message():
    return jsonify({"message": test.hello('AAPL')})  # Fix the function call



@app.route('/stock_search', methods=['GET'])
def stock_search():
    stock_symbol = request.args.get("stock")  # Get "stock" query parameter
    if stock_symbol:
        return jsonify(test.get_stock_search(stock_symbol))  # Example response
    return jsonify({"error": "Stock not found"}), 400

@app.route("/stock_data", methods=["GET"])
def get_stock_data():
    stock_symbol = request.args.get("stock", "AAPL")  # Default stock
    time_range = request.args.get("range", "6mo")  # Default to 6 months

    # Use '1d' interval for smoother data
    stock = yf.Ticker(stock_symbol)
    hist = stock.history(period=time_range, interval="1d")  # Get daily prices

    if hist.empty:
        return jsonify({"error": "Stock symbol not found or no data available"}), 404

    labels = hist.index.strftime("%Y-%m-%d").tolist()  # Dates
    prices = hist["Close"].tolist()  # Closing prices

    return jsonify({"labels": labels, "prices": prices})



@app.route('/api/market-movers', methods=['GET'])
def get_market_movers():
    # Get S&P 500 tickers
    sp500_url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    data = pd.read_html(sp500_url)
    sp500_tickers = data[0]['Symbol'].tolist()[:100]  # Get first 100 for speed
    
    # Fetch data for these tickers
    data = yf.download(
        tickers=sp500_tickers,
        period="2d",
        interval="1d",
        group_by="ticker"
    )
    
    # Calculate daily change
    movers = []
    
    for ticker in sp500_tickers:
        try:
            # Get last 2 days of closing prices if available
            if ticker in data and len(data[ticker]) >= 2:
                prev_close = data[ticker]['Close'].iloc[-2]
                current_close = data[ticker]['Close'].iloc[-1]
                volume = data[ticker]['Volume'].iloc[-1]
                
                if not pd.isna(prev_close) and not pd.isna(current_close) and prev_close > 0:
                    pct_change = ((current_close - prev_close) / prev_close) * 100
                    
                    # Get company name and sector
                    try:
                        stock_info = yf.Ticker(ticker).info
                        company_name = stock_info.get('shortName', ticker)
                        sector = stock_info.get('sector', 'Unknown')
                    except:
                        company_name = ticker
                        sector = 'Unknown'
                    
                    movers.append({
                        'ticker': ticker,
                        'name': company_name,
                        'sector': sector,
                        'price': round(current_close, 2),
                        'change': round(pct_change, 2),
                        'volume': int(volume)
                    })
        except Exception as e:
            print(f"Error processing {ticker}: {e}")
    
    # Sort by absolute percentage change to get biggest movers
    movers = sorted(movers, key=lambda x: abs(x['change']), reverse=True)
    
    # Return top 20 movers
    return jsonify({
        'gainers': [m for m in movers if m['change'] > 0][:10],
        'losers': [m for m in movers if m['change'] < 0][:10]
    })


PERPLEXITY_API_KEY = "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"  # Replace with your actual API key
PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"

@app.route("/ask", methods=["POST"])
def ask_perplexity():
    data = request.json
    query = data.get("question", "")

    if not query:
        return jsonify({"error": "No question provided"}), 400

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}"
    }

    payload = {
        "model": "sonar-pro",
        "messages": [
            {"role": "system", "content": "Be precise and concise. You have to search the web for current information about only the stocks given to you. Make an analysis and prediction based on the news. Give the user a suggestion on whether to buy, hold or sell."},
            {"role": "user", "content": query}
        ]
    }

    response = requests.post(PERPLEXITY_API_URL, headers=headers, json=payload)

    return jsonify(response.json())


def generate_random_scenarios(n=10):
    """
    Imagine this calls a perplexity API or some other service
    to create random 'economic event' scenarios.
    Here, we'll just return a static or sample set of events
    or random data for demonstration.
    """
    all_possible = [
        {"event": "Inflation Spike", "impact": -0.10,  "description": "High inflation reduces purchasing power."},
        {"event": "Federal Rate Hike", "impact": -0.08, "description": "Higher interest rates slow stock growth."},
        {"event": "Tech Boom", "impact": 0.15, "description": "A surge in tech stocks drives up gains."},
        {"event": "Market Crash", "impact": -0.20, "description": "A sudden downturn causes large losses."},
        {"event": "Steady Growth", "impact": 0.05, "description": "Gradual market growth over time."},
        {"event": "Energy Crisis", "impact": -0.12, "description": "Spiking oil prices reduce profits."},
        {"event": "Housing Bubble", "impact": -0.15, "description": "Overvaluation leads to rapid loss."},
        {"event": "Biotech Breakthrough", "impact": 0.1, "description": "New medical tech sees big stock gains."},
        {"event": "Corporate Tax Cut", "impact": 0.07, "description": "Lower taxes boost corporate earnings."},
        {"event": "Consumer Spending Surge", "impact": 0.08, "description": "Strong retail sales lift profits."}
    ]
    # Randomly select n scenarios from the pool
    return random.sample(all_possible, k=n)

# Placeholder: Replace with your own perplexity API integration.
def generate_hint():
    """
    Calls Perplexity API to get a market-related investment hint.
    """
    PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}"
    }

    # Constructing a query for the AI model
    payload = {
        "model": "sonar-pro",
        "messages": [
            {"role": "system", "content": "Provide a concise but valuable investment tip or strategy based on current market conditions. Focus on risk management, portfolio diversification, or timing investments. Limit your answer to two sentences."},
            {"role": "user", "content": "Give me an investment tip for today."}
        ]
    }

    try:
        response = requests.post(PERPLEXITY_API_URL, headers=headers, json=payload)
        response_data = response.json()
        
        # Extract the Perplexity-generated hint
        hint = response_data.get("choices", [{}])[0].get("message", {}).get("content", "No hint available.")
        return hint

    except Exception as e:
        print(f"Error fetching hint: {e}")
        return "Could not retrieve market insights at this time."

@app.route("/api/scenarios", methods=["GET"])
def get_scenarios():
    try:
        scenarios = generate_random_scenarios(10)
        return jsonify({"scenarios": scenarios})  # Ensure it's always JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/hint", methods=["GET"])
def get_hint():
    """
    Calls Perplexity API to generate an investment tip and returns it.
    """
    hint = generate_hint()
    return jsonify({"hint": hint})


@app.route('/api/get_headline', methods=['GET'])
def get_headline():
    research_data = yf.Search("apple", include_research=True).research
    headlines = []
    if research_data:
        for item in research_data:
            headlines.append(item.get("reportHeadline", "No title available"))
    headlines_ = jsonify(headlines)
    return headlines_


ALPHAVANTAGE_API_KEY = "OUAZELU9JYNRPHHL"
URL = f"https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=OUAZELU9JYNRPHHL"

@app.route('/api/top-movers')
def get_top_movers():
    try:
        # Get top gainers/losers using Alpha Vantage
        url = f"https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey={ALPHAVANTAGE_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        if "error" in data:
            return jsonify({"error": data["error"]})
            
        # Process top gainers
        top_gainers = []
        for item in data.get("top_gainers", [])[:10]:
            top_gainers.append({
                'ticker': item.get("ticker", ""),
                'price': item.get("price", ""),
                'change_amount': item.get("change_amount", ""),
                'change_percentage': item.get("change_percentage", "").replace("+", "")
            })
            
        # Process top losers
        top_losers = []
        for item in data.get("top_losers", [])[:10]:
            top_losers.append({
                'ticker': item.get("ticker", ""),
                'price': item.get("price", ""),
                'change_amount': item.get("change_amount", ""),
                'change_percentage': item.get("change_percentage", "").replace("+", "")
            })
            
        # Process most active
        most_active = []
        for item in data.get("most_actively_traded", [])[:10]:
            most_active.append({
                'ticker': item.get("ticker", ""),
                'price': item.get("price", ""),
                'change_amount': item.get("change_amount", ""),
                'change_percentage': item.get("change_percentage", "").replace("+", "")
            })
            
        return jsonify({
            'top_gainers': top_gainers,
            'top_losers': top_losers,
            'most_active': most_active
        })
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/stock-chart/<ticker>')
def get_stock_chart(ticker):
    try:
        # Get daily time series data for the ticker
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={ALPHAVANTAGE_API_KEY}&outputsize=compact"
        response = requests.get(url)
        data = response.json()
        
        if "Error Message" in data:
            return jsonify({"error": data["Error Message"]})
        if "Information" in data and "Alpha Vantage" in data["Information"]:
            return jsonify({"error": data["Information"]})
            
        time_series = data.get("Time Series (Daily)", {})
        
        # Format data for the chart
        chart_data = []
        # Sort dates in descending order (newest first) and limit to 30 days
        sorted_dates = sorted(time_series.keys(), reverse=True)[:30]
        
        # Reverse to get chronological order for the chart
        for date in reversed(sorted_dates):
            price_data = time_series[date]
            chart_data.append({
                'date': date,
                'price': round(float(price_data["4. close"]), 2)
            })
        
        return jsonify({
            'ticker': ticker,
            'chart_data': chart_data
        })
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/api/company-info/<ticker>')
def get_company_info(ticker):
    try:
        # Get company information using Alpha Vantage
        url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={ticker}&apikey={ALPHAVANTAGE_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        # Check for errors
        if "Error Message" in data:
            return jsonify({"error": data["Error Message"]})
        if not data or "Information" in data:
            # If we can't get data, return just the ticker as the name
            return jsonify({"name": ticker, "ticker": ticker})
            
        # Extract the company name
        company_name = data.get("Name", ticker)
        
        return jsonify({
            "ticker": ticker,
            "name": company_name,
            "sector": data.get("Sector", ""),
            "industry": data.get("Industry", ""),
            "description": data.get("Description", "")
        })
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route("/stock_data_by_date", methods=["GET"])
def get_stock_data_by_date():
    stock_symbol = request.args.get("stock")
    purchase_date_str = request.args.get("purchaseDate")
    
    if not purchase_date_str:
        return jsonify({"error": "Purchase date is required"}), 400

    # Validate and convert purchase_date to a date object
    try:
        purchase_date = datetime.strptime(purchase_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid purchase date format, expected YYYY-MM-DD"}), 400

    stock = yf.Ticker(stock_symbol)
    
    # Attempt to fetch data for the given date. If the date is not a trading day,
    # move backwards until you find a day with data (up to a maximum number of attempts).
    attempts = 0
    max_attempts = 7
    target_date = purchase_date
    data = None

    while attempts < max_attempts:
        target_date_str = target_date.strftime("%Y-%m-%d")
        # Set the end date as the next day to only fetch one day's data.
        next_day = target_date + timedelta(days=1)
        next_day_str = next_day.strftime("%Y-%m-%d")
        data = stock.history(start=target_date_str, end=next_day_str)
        if not data.empty:
            break
        target_date = target_date - timedelta(days=1)
        attempts += 1

    if data is None or data.empty:
        return jsonify({"error": "No data available for the given purchase date and fallback period"}), 404

    # Extract the close price for that day.
    close_price = data["Close"].iloc[0]
    
    return jsonify({"date": target_date_str, "price": close_price})


@app.route('/api/yahoo-finance', methods=['GET'])
def yahoo_finance():
    # Get the company parameter from the query string
    company = request.args.get('company')
    if not company:
        return jsonify({"error": "Missing company parameter"}), 400

    try:
        # Parse out the company name from the label (e.g., "Apple (AAPL)" -> "Apple")
        company_query = company.split(" (")[0]
        research_data = yf.Search(company_query, include_research=True).research
        
        # Extract the top headlines from the research data
        headlines = []
        if research_data:
            for item in research_data:
                headline = item.get("reportHeadline")
                if headline:
                    headlines.append(headline)
        
        # If no headlines are available, provide a placeholder message.
        if not headlines:
            headlines = [f"No headlines found for {company_query}."]
            
        return jsonify({"headlines": headlines})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=False)