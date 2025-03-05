import yfinance as yf
import pandas as pd
from datetime import datetime
import time
from tqdm import tqdm
import os
import requests

def get_nse_stocks():
    """
    Get list of all NSE stocks
    Returns a list of stock symbols with '.NS' suffix for NSE stocks
    """
    try:
        # Get full equity list from NSE
        url = "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise exception for bad status codes
        
        # Save the CSV content to a temporary file
        with open('temp_equity.csv', 'wb') as f:
            f.write(response.content)
        
        # Read the CSV file
        df = pd.read_csv('temp_equity.csv')
        
        # Clean up temporary file
        os.remove('temp_equity.csv')
        
        # Extract and clean symbols
        symbols = [f"{symbol.strip()}.NS" for symbol in df['SYMBOL'] if isinstance(symbol, str)]
        
        # Remove duplicates and sort
        symbols = sorted(list(set(symbols)))
        
        print(f"Successfully fetched {len(symbols)} symbols from NSE")
        return symbols
        
    except Exception as e:
        print(f"Error fetching NSE stocks: {e}")
        return []

def get_stock_data(ticker_symbol, period='1y', interval='1d'):
    """
    Get daily stock data from Yahoo Finance for the past year
    """
    try:
        # Create ticker object
        ticker = yf.Ticker(ticker_symbol)
        
        # Get historical data with daily interval for past year
        df = ticker.history(period=period, interval=interval, actions=False)
        
        if df.empty:
            return None
            
        # Reset index and add symbol
        df.reset_index(inplace=True)
        df['Symbol'] = ticker_symbol
        
        # Format date column
        df['Date'] = pd.to_datetime(df['Date']).dt.date
        
        # Keep only essential columns and ensure they exist
        essential_columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Symbol']
        for col in essential_columns:
            if col not in df.columns:
                print(f"Missing column {col} for {ticker_symbol}")
                return None
                
        df = df[essential_columns]
        
        return df
    
    except Exception as e:
        if "not found" in str(e).lower():
            print(f"Symbol not found: {ticker_symbol}")
        else:
            print(f"Error fetching data for {ticker_symbol}: {e}")
        return None

def save_data(df, filename):
    """
    Save data to CSV with proper handling
    """
    try:
        os.makedirs('data', exist_ok=True)
        filepath = os.path.join('data', filename)
        df.to_csv(filepath, index=False)
        print(f"Data saved to {filepath}")
        return True
    except Exception as e:
        print(f"Error saving file {filename}: {e}")
        return False

def main():
    # Start timing
    start_time = time.time()
    
    print("Fetching list of NSE stocks...")
    nse_stocks = get_nse_stocks()
    
    if not nse_stocks:
        print("Failed to fetch NSE stocks list.")
        return
    
    print(f"Found {len(nse_stocks)} stocks")
    
    # Initialize DataFrame for all stock data
    all_stock_data = pd.DataFrame()
    
    # Process stocks with progress bar
    print("\nFetching daily data for the past year...")
    successful_stocks = 0
    failed_stocks = 0
    
    try:
        for i, symbol in enumerate(tqdm(nse_stocks), 1):
            # Get stock data
            stock_data = get_stock_data(symbol)
            
            if stock_data is not None and not stock_data.empty:
                all_stock_data = pd.concat([all_stock_data, stock_data], ignore_index=True)
                successful_stocks += 1
            else:
                failed_stocks += 1
            
            # Add delay to avoid rate limiting
            time.sleep(2)  # 2 second delay between requests
            
    except KeyboardInterrupt:
        print("\nProcess interrupted by user. Saving collected data...")
    except Exception as e:
        print(f"\nUnexpected error occurred: {e}")
    finally:
        # Save all data to a single file
        if not all_stock_data.empty:
            # Sort data by Date and Symbol
            all_stock_data = all_stock_data.sort_values(['Date', 'Symbol'])
            
            # Create filename with date range
            min_date = all_stock_data['Date'].min()
            max_date = all_stock_data['Date'].max()
            filename = f"nse_stocks_daily_{min_date}_to_{max_date}.csv"
            
            if save_data(all_stock_data, filename):
                print(f"\nAll data saved to data/{filename}")
            
            # Calculate execution time
            execution_time = time.time() - start_time
            
            print("\nSummary:")
            print(f"Total stocks processed: {successful_stocks + failed_stocks}")
            print(f"Successful extractions: {successful_stocks}")
            print(f"Failed extractions: {failed_stocks}")
            print(f"Total records collected: {len(all_stock_data)}")
            print(f"Unique symbols in dataset: {all_stock_data['Symbol'].nunique()}")
            print(f"Date range: {min_date} to {max_date}")
            print(f"Execution time: {execution_time:.2f} seconds ({execution_time/60:.2f} minutes)")
        else:
            print("No data was collected!")

if __name__ == "__main__":
    main() 