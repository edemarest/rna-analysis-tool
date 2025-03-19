import os
import subprocess
import shutil
import cairosvg

PLOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../tests/plots"))
os.makedirs(PLOT_DIR, exist_ok=True)

def predict_structure(inputs):
    sequence = inputs.get("sequence", "").strip()
    seq_type = inputs.get("Sequence Type", "").strip()
    energy_cutoff = inputs.get("Energy Cutoff", None)

    if not sequence:
        return {"error": "No sequence provided"}

    if seq_type not in ["mRNA", "tRNA", "rRNA"]:
        return {"error": "Invalid sequence type"}

    try:
        result = subprocess.run(["RNAfold", "-p"], input=sequence, capture_output=True, text=True)
        output = result.stdout.strip().split("\n")

        if len(output) < 2:
            return {"error": "RNAfold failed to generate output"}

        structure = output[1].split(" ")[0]
        mfe = output[1].split(" ")[-1].strip("()")
        mfe_value = float(mfe)

        if energy_cutoff is not None:
            try:
                energy_cutoff = float(energy_cutoff)
                if mfe_value > energy_cutoff:
                    return {"error": f"Predicted structure energy {mfe_value} exceeds cutoff {energy_cutoff}"}
            except ValueError:
                return {"error": "Invalid energy cutoff value"}

        base_filename = os.path.join(PLOT_DIR, sequence[:10])
        ps_filename = f"{base_filename}.ps"
        pdf_filename = f"{base_filename}.pdf"
        svg_filename = f"{base_filename}.svg"

        if os.path.exists("rna.ps"):
            shutil.move("rna.ps", ps_filename)
        else:
            return {"error": "RNAfold did not create rna.ps"}

        subprocess.run(["ps2pdf", ps_filename, pdf_filename])

        cairosvg.svg2svg(url=pdf_filename, write_to=svg_filename)

        return {
            "sequence": sequence,
            "structure": structure,
            "mfe": mfe_value,
            "plot": svg_filename
        }

    except Exception as e:
        return {"error": str(e)}
