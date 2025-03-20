from flask import Flask
from routes import routes
from flask_cors import CORS
import os

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../output"))

app = Flask(__name__)
app.static_folder = OUTPUT_DIR
app.static_url_path = "/output"

CORS(app)
app.register_blueprint(routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
