from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

def get_message():
    """Simulated Python logic to generate a message."""
    return "Hello from Python! This message is dynamically generated."

@app.route('/api/message', methods=['GET'])
def get_message():
    """API endpoint to send the generated message to React."""
    message = get_message()  # Call Python function
    return jsonify({'message': message})

if __name__ == '__main__':
    app.run(debug=True, port=5000)