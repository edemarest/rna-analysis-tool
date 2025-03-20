import os
import subprocess
import shutil
import glob
import base64

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../output"))
MAX_SEQ_LENGTH = 3000
os.makedirs(OUTPUT_DIR, exist_ok=True)

def predict_structure(inputs):
    try:
        sequence = inputs.get("sequence", "").strip()
        seq_type = inputs.get("Sequence Type", "").strip()
        file_name = inputs.get("File Name", "rna_structure")  
        energy_cutoff = inputs.get("Energy Cutoff")

        if len(sequence) > MAX_SEQ_LENGTH:
            print(f"[ERROR] Sequence too long: {len(sequence)} nt (Max: {MAX_SEQ_LENGTH} nt)")
            return {"error": f"Sequence too long ({len(sequence)} nt). Max allowed: {MAX_SEQ_LENGTH} nt"}

        if not sequence:
            print("[ERROR] No sequence provided.")
            return {"error": "No sequence provided"}

        if seq_type not in ["mRNA", "tRNA", "rRNA"]:
            print(f"[ERROR] Invalid sequence type: {seq_type}")
            return {"error": "Invalid sequence type"}

        if energy_cutoff is not None:
            print(f"[DEBUG] Received Energy Cutoff: {energy_cutoff} (Type: {type(energy_cutoff)})")
            try:
                energy_cutoff = float(energy_cutoff) 
            except ValueError:
                print(f"[ERROR] Energy Cutoff conversion failed: {energy_cutoff}")
                return {"error": "Energy Cutoff must be a valid number."}

        print(f"[DEBUG] Processing RNA structure for {file_name} ({len(sequence)} nt) with Energy Cutoff: {energy_cutoff}")

        prev_cwd = os.getcwd()
        os.chdir(OUTPUT_DIR)
        result = subprocess.run(["RNAfold", "-p"], input=sequence, capture_output=True, text=True)
        os.chdir(prev_cwd)

        output_lines = result.stdout.strip().split("\n")

        print("[DEBUG] RNAfold raw output:")
        print("\n".join(output_lines))

        mfe_line = next((line for line in output_lines if "(" in line and ")" in line), None)

        if mfe_line is None:
            print("[ERROR] No valid MFE line found in RNAfold output")
            return {"error": "RNAfold did not output a valid MFE value"}

        print(f"[DEBUG] Extracted MFE line: {mfe_line}")

        try:
            structure, mfe_value_str = mfe_line.rsplit(" ", 1)
            mfe_value = float(mfe_value_str.strip("()"))
        except ValueError:
            print(f"[ERROR] Failed to parse MFE from: {mfe_line}")
            return {"error": f"Failed to parse MFE value: {mfe_line}"}

        print(f"[DEBUG] Parsed MFE: {mfe_value}")

        if energy_cutoff is not None and mfe_value > energy_cutoff:
            return {"error": f"Predicted structure energy {mfe_value} exceeds cutoff {energy_cutoff}"}

        print(f"[DEBUG] MFE parsed successfully: {mfe_value}")

        ps_files = glob.glob(os.path.join(OUTPUT_DIR, "*.ps"))
        ss_ps_file = None

        for ps_file in ps_files:
            if "_ss.ps" in ps_file or "ss.ps" in ps_file:
                ss_ps_file = ps_file
                break

        if not ss_ps_file:
            print(f"[ERROR] Expected SS PS file not found in {OUTPUT_DIR}")
            print("[DEBUG] Found PS files:", ps_files)
            return {"error": f"Expected SS PS file not found in {OUTPUT_DIR}"}

        print(f"[DEBUG] Using SS PS file: {ss_ps_file}")

        first_line = sequence.split("\n")[0].strip()
        if first_line.startswith(">"):
            fasta_name = first_line[1:].strip()
        else:
            fasta_name = file_name

        safe_fasta_name = "".join(c if c.isalnum() or c in "-_" else "_" for c in fasta_name)

        print(f"[DEBUG] Using standardized Fasta name: {safe_fasta_name}")

        base_filename = os.path.join(OUTPUT_DIR, safe_fasta_name)
        pdf_filename = f"{base_filename}_figure.pdf"
        svg_filename = f"{base_filename}_figure.svg"
        final_svg_filename = svg_filename
        mfe_txt_filename = f"{base_filename}_mfe.txt"
        dotbracket_txt_filename = f"{base_filename}_structure.txt"

        modified_ps_file = f"{ss_ps_file}_thickened.ps"

        with open(ss_ps_file, "r") as ps:
            ps_data = ps.read()

        ps_data = ps_data.replace("0.5 setlinewidth", "2 setlinewidth")

        with open(modified_ps_file, "w") as ps:
            ps.write(ps_data)

        subprocess.run(["ps2pdf", modified_ps_file, pdf_filename])

        result = subprocess.run(["pdf2svg", pdf_filename, svg_filename], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"[ERROR] pdf2svg failed: {result.stderr}")
            return {"error": "Failed to generate SVG from PDF"}

        with open(mfe_txt_filename, "w") as mfe_file:
            mfe_file.write(f"Minimum Free Energy: {mfe_value} kcal/mol\n")

        with open(dotbracket_txt_filename, "w") as struct_file:
            struct_file.write(f"Sequence: {sequence}\nStructure: {structure}\n")

        print("[DEBUG] RNA structure processing complete.")

        with open(final_svg_filename, "rb") as svg_file:
            encoded_svg = base64.b64encode(svg_file.read()).decode("utf-8")

        return {
            "mfe": mfe_value,
            "dot_structure": dotbracket_txt_filename,
            "plot": f"data:image/svg+xml;base64,{encoded_svg}"
        }

    except Exception as e:
        print(f"[ERROR] Exception in predict_structure: {str(e)}")
        return {"error": str(e)}
