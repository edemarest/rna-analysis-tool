import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from functions.predict_structure import predict_structure

test_cases = [
    {
        "sequence": "AUGCGUAGCUAGUAGC",
        "Sequence Type": "mRNA",
        "Energy Cutoff": -5.0
    },
    {
        "sequence": "GCGGGAUUACCGU",
        "Sequence Type": "rRNA"
    },
    {
        "sequence": "",
        "Sequence Type": "mRNA"
    },
    {
        "sequence": "AGCUAGCUAGC",
        "Sequence Type": "Unknown"
    },
    {
        "sequence": "AGCUA",
        "Sequence Type": "tRNA",
        "Energy Cutoff": "invalid"
    }
]

def test_fasta_file(fasta_path):
    print(f"[DEBUG] Reading FASTA file: {fasta_path}")

    with open(fasta_path, "r") as f:
        lines = f.readlines()
    
    sequence = "".join([line.strip() for line in lines if not line.startswith(">")])

    print(f"[DEBUG] Extracted sequence length: {len(sequence)}")

    test_input = {
        "sequence": sequence,
        "Sequence Type": "mRNA"
    }
    
    print("[DEBUG] Running RNA structure prediction...")
    result = predict_structure(test_input)

    print("Output:", json.dumps(result, indent=2))
    print("-" * 40)

def run_standard_tests():
    for i, test in enumerate(test_cases):
        print(f"Test {i+1}: {json.dumps(test, indent=2)}")
        result = predict_structure(test)
        print("Output:", json.dumps(result, indent=2))
        print("-" * 40)

if __name__ == "__main__":
    if "--fasta" in sys.argv:
        FASTA_FILE = os.path.join(os.path.dirname(__file__), "sequences", "s2.fasta")
        if os.path.exists(FASTA_FILE):
            test_fasta_file(FASTA_FILE)
        else:
            print(f"[ERROR] FASTA file not found: {FASTA_FILE}")
    else:
        run_standard_tests()
