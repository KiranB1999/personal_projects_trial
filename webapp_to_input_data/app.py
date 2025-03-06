from flask import Flask, request, jsonify
import openpyxl

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.json
    name = data['name']
    email = data['email']
    age = data['age']

    # Load or create Excel file
    try:
        workbook = openpyxl.load_workbook('data.xlsx')
        sheet = workbook.active
    except FileNotFoundError:
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.append(['Name', 'Email', 'Age'])  # Adding header

    # Append the data to the Excel sheet
    sheet.append([name, email, age])

    # Save the Excel file
    workbook.save('data.xlsx')

    return jsonify({'message': 'Data saved successfully!'})

if __name__ == '__main__':
    app.run(debug=True)
