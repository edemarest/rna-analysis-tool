from flask import Blueprint, request, jsonify
from flask_cors import CORS
from handlers import FUNCTION_HANDLERS

routes = Blueprint("routes", __name__)
CORS(routes)

SEQUENCES = []

def _set_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

def _build_cors_preflight_response():
    response = jsonify({"message": "CORS preflight successful"})
    response = _set_cors_headers(response)
    response.status_code = 200
    return response

@routes.route("/predict_structure", methods=["POST"])
def predict_structure_route():
    data = request.get_json()
    
    if "predict_structure" not in FUNCTION_HANDLERS:
        return jsonify({"error": "Function not found"}), 400

    result = FUNCTION_HANDLERS["predict_structure"](data)
    return jsonify(result)

@routes.route("/<function_name>", methods=["POST", "OPTIONS"])
def execute_function(function_name):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    function_name = function_name.strip().lower()
    function_lookup = {key.lower(): key for key in FUNCTION_HANDLERS}

    if function_name not in function_lookup:
        return jsonify({"error": f"Function '{function_name}' not found"}), 400

    corrected_function_name = function_lookup[function_name]
    result = FUNCTION_HANDLERS[corrected_function_name](request.get_json())

    return jsonify({"function": corrected_function_name, "results": result})
