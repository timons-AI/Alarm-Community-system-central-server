from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS, cross_origin
from twilio.rest import Client
import mysql.connector

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Create a Blueprint for the API
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


# generate sample data
def generate_sample_data():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    if not users:
        cursor.execute("""INSERT INTO users (name, phone_number) VALUES ('John Doe', '1234567890')""")
        cursor.execute("""INSERT INTO users (name, phone_number) VALUES ('Jane Doe', '0987654321')""")
        cursor.execute("""INSERT INTO users (name, phone_number) VALUES ('Alice Doe', '1230984567')""")
        db.commit()

    cursor.execute("SELECT * FROM devices")
    devices = cursor.fetchall()
    if not devices:
        cursor.execute("""INSERT INTO devices (user_id, device_id) VALUES (1, '123456')""")
        cursor.execute("""INSERT INTO devices (user_id, device_id) VALUES (2, '654321')""")
        cursor.execute("""INSERT INTO devices (user_id, device_id) VALUES (3, '456789')""")
        db.commit()

    cursor.execute("SELECT * FROM alarms")
    alarms = cursor.fetchall()
    if not alarms:
        cursor.execute("""INSERT INTO alarms (user_id, status) VALUES (1, 'triggered')""")
        cursor.execute("""INSERT INTO alarms (user_id, status) VALUES (2, 'deactivated')""")
        cursor.execute("""INSERT INTO alarms (user_id, status) VALUES (3, 'triggered')""")
        db.commit()

# Call the function to generate sample data
# generate_sample_data()

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
@cross_origin()
def register_user():
    data = request.get_json()
    name = data['name']
    phone_number = data['phone_number']
    cursor = db.cursor()
    cursor.execute("""INSERT INTO users (name, phone_number) VALUES (%s, %s)""", (name, phone_number))
    db.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/register_device', methods=['POST'])
@cross_origin()
def register_device():
    data = request.get_json()
    user_id = data['user_id']
    device_id = data['device_id']
    cursor = db.cursor()
    cursor.execute("""INSERT INTO devices (user_id, device_id) VALUES (%s, %s)""", (user_id, device_id))
    db.commit()
    return jsonify({"message": "Device registered successfully"}), 201

@app.route('/users', methods=['GET'])
@cross_origin()
def get_users():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    user_list = []
    for user in users:
        user_dict = {
            'id': user[0],
            'name': user[1],
            'phone_number': user[2]
        }
        user_list.append(user_dict)
    return jsonify(user_list), 200

@app.route('/user_devices/<int:user_id>', methods=['GET'])
@cross_origin()
def get_user_devices(user_id):
    cursor = db.cursor()
    cursor.execute("""SELECT * FROM devices WHERE user_id=%s""", (user_id,))
    devices = cursor.fetchall()
    device_list = []
    for device in devices:
        device_dict = {
            'id': device[0],
            'device_id': device[1]
        }
        device_list.append(device_dict)
    return jsonify(device_list), 200

@app.route('/trigger_alarm', methods=['POST'])
@cross_origin()
def trigger_alarm():
    # Check if request is JSON
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    # Check if 'phone_number' key exists
    phone_number = data.get('phone_number')
    if not phone_number:
        return jsonify({"error": "Missing phone_number"}), 400

    cursor = db.cursor()
    cursor.execute("""SELECT id FROM users WHERE phone_number=%s""", (phone_number,))
    user = cursor.fetchone()
    if user:
        cursor.execute("""INSERT INTO alarms (user_id, status) VALUES (%s, 'triggered')""", (user[0],))
        db.commit()
        # send_notifications(phone_number, "Alarm triggered!")
        # beep_phones()
        return jsonify({"message": "Alarm triggered"})
    return jsonify({"message": "User not found"}), 404

@app.route('/deactivate_alarm', methods=['POST'])
@cross_origin()
def deactivate_alarm():
    data = request.get_json()
    phone_number = data.get('phone_number')
    cursor = db.cursor()
    cursor.execute("""SELECT id FROM users WHERE phone_number=%s""", (phone_number,))
    user = cursor.fetchone()
    if user:
        cursor.execute("""UPDATE alarms SET status='deactivated' WHERE user_id=%s AND status='triggered'""", (user[0],))
        db.commit()
        # send_notifications(phone_number, "Alarm deactivated!")
        return jsonify({"message": "Alarm deactivated"})
    return jsonify({"message": "User not found"}), 404

def send_notifications(phone_number, message):
    cursor = db.cursor()
    cursor.execute("""SELECT phone_number FROM users""")
    users = cursor.fetchall()
    for user in users:
        client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=user[0]
        )
# Register the blueprint with the app
app.register_blueprint(api)


def beep_phones():
    cursor = db.cursor()
    cursor.execute("""SELECT phone_number FROM users""")
    users = cursor.fetchall()
    for user in users:
        client.calls.create(
            twiml='<Response><Say>Alarm triggered! Please check your device.</Say></Response>',
            to=user[0],
            from_=TWILIO_PHONE_NUMBER
        )


if __name__ == '__main__':
    app.run(debug=True)


# all routes
# POST /register_user
# POST /register_device
# GET /users
# GET /user_devices/<int:user_id>
# POST /trigger_alarm
# POST /deactivate_alarm

