from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS, cross_origin
from twilio.rest import Client
import mysql.connector

app = Flask(__name__)
# CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# # Create a Blueprint for the API
api = Blueprint('api', __name__, url_prefix='/api')

# Twilio configuration
TWILIO_ACCOUNT_SID = 'your_account_sid'
TWILIO_AUTH_TOKEN = 'your_auth_token'
TWILIO_PHONE_NUMBER = 'your_twilio_phone_number'
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="laravel_user",
    password="laravel_user",
    database="acs"
)


# Define routes
@app.route('/')
def index():
    return 'Hello World'

@app.route('/api')
def api_index():
    return 'Hello World from API'

@api.route('/hello')
def hello():
    return 'Hello from the API'




@app.route('/register_user', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data['name']
    phone_number = data['phone_number']
    cursor = db.cursor()
    cursor.execute("""INSERT INTO users (name, phone_number) VALUES (%s, %s)""", (name, phone_number))
    db.commit()
    return jsonify({"message": "User registered successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)