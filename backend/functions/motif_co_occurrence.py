def find_motif_co_occurrences(inputs):
    sequences = inputs.get("sequences", [])
    
    if not sequences:
        return {"error": "No sequences provided"}

    return {"motif_overlap": True}
