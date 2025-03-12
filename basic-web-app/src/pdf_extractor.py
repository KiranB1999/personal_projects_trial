import tabula
import pandas as pd
import json
import sys

def extract_tables_from_pdf(pdf_path):
    try:
        # Extract tables from PDF
        tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)
        
        # Convert tables to JSON-serializable format
        processed_tables = []
        for table in tables:
            # Convert DataFrame to dict and handle NaN values
            table_dict = table.fillna('').to_dict('records')
            processed_tables.append(table_dict)
        
        result = {
            'success': True,
            'tables': processed_tables
        }
        
    except Exception as e:
        result = {
            'success': False,
            'error': str(e)
        }
    
    # Print result as JSON for Node.js to capture
    print(json.dumps(result))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        extract_tables_from_pdf(pdf_path)
    else:
        print(json.dumps({
            'success': False,
            'error': 'No PDF path provided'
        }))