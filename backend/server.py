from flask import Flask, request
from routes import routes
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS globally
CORS(app)

app.register_blueprint(routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
