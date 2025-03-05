from flask import Flask, render_template, jsonify
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np

app = Flask(__name__)

def calculate_rsi(data, periods=14):
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_stochastic(data, k_period=14, d_period=3):
    low_min = data['Low'].rolling(window=k_period).min()
    high_max = data['High'].rolling(window=k_period).max()
    k = 100 * ((data['Close'] - low_min) / (high_max - low_min))
    d = k.rolling(window=d_period).mean()
    return k, d

def analyze_kd_signals(df):
    df['K_Above_D'] = df['K'] > df['D']
    df['Next_Day_Open'] = df['Open'].shift(-1)
    df['Current_Close'] = df['Close']
    df['Signal_Correct'] = np.where(
        df['K_Above_D'],
        df['Next_Day_Open'] > df['Current_Close'],
        df['Next_Day_Open'] < df['Current_Close']
    )
    return df

def get_stock_data():
    stock_symbol = 'JSWENERGY.NS'
    end_date = datetime.now()
    start_date = end_date - timedelta(days=2*365)
    
    jsw = yf.Ticker(stock_symbol)
    df = jsw.history(start=start_date, end=end_date)
    df = df.reset_index()
    
    df['RSI'] = calculate_rsi(df['Close'])
    df['K'], df['D'] = calculate_stochastic(df)
    df['Daily_Return'] = df['Close'].pct_change() * 100
    df['Moving_Avg_20'] = df['Close'].rolling(window=20).mean()
    df['Moving_Avg_50'] = df['Close'].rolling(window=50).mean()
    
    df = analyze_kd_signals(df)
    return df

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/stock-data')
def stock_data():
    df = get_stock_data()
    
    fig = make_subplots(rows=5, cols=1, 
                        shared_xaxes=True,
                        vertical_spacing=0.05,
                        row_heights=[0.4, 0.15, 0.15, 0.15, 0.15])

    # Add candlestick
    fig.add_trace(go.Candlestick(
        x=df['Date'],
        open=df['Open'],
        high=df['High'],
        low=df['Low'],
        close=df['Close'],
        name='OHLC'
    ), row=1, col=1)

    # Add moving averages
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['Moving_Avg_20'],
        line=dict(color='orange', width=1),
        name='20-day MA'
    ), row=1, col=1)

    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['Moving_Avg_50'],
        line=dict(color='blue', width=1),
        name='50-day MA'
    ), row=1, col=1)

    # Add volume
    fig.add_trace(go.Bar(
        x=df['Date'],
        y=df['Volume'],
        name='Volume',
        marker_color='rgba(128,128,128,0.5)'
    ), row=2, col=1)

    # Add RSI
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['RSI'],
        line=dict(color='purple', width=1),
        name='RSI'
    ), row=3, col=1)

    # Add Stochastic
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['K'],
        line=dict(color='blue', width=1),
        name='%K'
    ), row=4, col=1)

    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['D'],
        line=dict(color='red', width=1),
        name='%D'
    ), row=4, col=1)

    # Add Signal Accuracy
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['Signal_Correct'].rolling(window=20).mean() * 100,
        line=dict(color='green', width=1),
        name='Signal Accuracy'
    ), row=5, col=1)

    fig.update_layout(
        title='JSW Energy Technical Analysis',
        height=1200,
        template='plotly_dark',
        showlegend=True
    )

    # Calculate statistics - Convert numpy values to native Python types
    stats = {
        'current_price': float(df['Close'].iloc[-1]),
        'daily_change': float(df['Daily_Return'].iloc[-1]),
        'rsi': float(df['RSI'].iloc[-1]),
        'k_value': float(df['K'].iloc[-1]),
        'd_value': float(df['D'].iloc[-1]),
        'volume': int(df['Volume'].iloc[-1]),
        'signal': 'Buy' if df['K'].iloc[-1] > df['D'].iloc[-1] else 'Sell'
    }

    # Convert DataFrame to records and ensure all values are JSON serializable
    recent_data = df.tail(10).to_dict(orient='records')
    for record in recent_data:
        for key, value in record.items():
            if 'numpy' in str(type(value)):  # Check if it's a numpy type
                if isinstance(value, (np.integer, np.floating)):
                    record[key] = float(value)
                elif isinstance(value, np.datetime64):
                    record[key] = value.astype('datetime64[s]').item().isoformat()

    return jsonify({
        'chart': fig.to_json(),
        'stats': stats,
        'recent_data': recent_data
    })

if __name__ == '__main__':
    app.run(debug=True) 