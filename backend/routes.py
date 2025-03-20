from flask import Blueprint, request, jsonify
from flask_cors import CORS
from handlers import FUNCTION_HANDLERS
import os

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
    """Handles RNA structure prediction requests."""
    try:
        data = request.get_json()
        sequence = data.get("sequence", "").strip()
        sequence_type = data.get("Sequence Type", "mRNA").strip()
        file_name = data.get("File Name", "rna_structure").strip()
        energy_cutoff = data.get("Energy Cutoff", None)

        if not sequence:
            return jsonify({"error": "No RNA sequence provided"}), 400
        if len(sequence) > 3000:
            return jsonify({"error": f"Sequence length ({len(sequence)} nt) exceeds max (3000 nt)"}), 400

        if energy_cutoff is not None:
            try:
                energy_cutoff = float(energy_cutoff)
            except ValueError:
                return jsonify({"error": "Invalid Energy Cutoff value. Must be a number."}), 400

        result = FUNCTION_HANDLERS["predict_structure"]({
            "sequence": sequence,
            "Energy Cutoff": energy_cutoff,
            "Sequence Type": sequence_type,
            "File Name": file_name
        })

        if "error" in result:
            return jsonify(result), 400

        return jsonify({
            "mfe": result.get("mfe"),
            "dot_structure": result.get("dot_structure"),
            "plot": result.get("plot")
        })

    except Exception as e:
        print(f"[ERROR] Internal Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@routes.route("/<function_name>", methods=["POST", "OPTIONS"])
def execute_function(function_name):
    """Handles all other function executions dynamically."""
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    function_name = function_name.strip().lower()
    function_lookup = {key.lower(): key for key in FUNCTION_HANDLERS}

    if function_name not in function_lookup:
        return jsonify({"error": f"Function '{function_name}' not found"}), 400

    corrected_function_name = function_lookup[function_name]
    result = FUNCTION_HANDLERS[corrected_function_name](request.get_json())

    return jsonify({"function": corrected_function_name, "results": result})
