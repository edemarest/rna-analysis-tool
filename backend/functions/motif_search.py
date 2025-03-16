import matplotlib.pyplot as plt
import numpy as np
import io
import base64
import time
import re

def motif_search(inputs):
    start_time = time.time()

    sequence = inputs.get("sequences", [None])[0]
    input_params = inputs.get("inputs", {})
    motif_length = input_params.get("Motif Length", None)

    if motif_length is None or not isinstance(motif_length, int) or motif_length <= 0:
        return {"error": "Invalid Motif Length"}

    if not sequence:
        return {"error": "No sequence provided"}

    motifs = {}
    motif_count = 0
    SEQ_LIMIT = 50_000

    sequence = sequence.upper()
    sequence = re.sub(r"[^ACGT]", "N", sequence)

    for i in range(min(len(sequence) - motif_length + 1, SEQ_LIMIT)):
        motif = sequence[i : i + motif_length]
        
        if not re.match(r"^[ACGT]+$", motif):
            continue

        if motif in motifs:
            motifs[motif].append(i)
        else:
            motifs[motif] = [i]

        motif_count += 1

    MAX_MOTIFS = 50
    sorted_motifs = sorted(motifs.items(), key=lambda x: len(x[1]), reverse=True)[:MAX_MOTIFS]
    motif_positions = {motif: positions for motif, positions in sorted_motifs}

    MAX_POINTS = 10_000
    total_points = sum(len(positions) for positions in motif_positions.values())
    scale_factor = min(1, MAX_POINTS / total_points) if total_points > MAX_POINTS else 1

    fig, ax = plt.subplots(figsize=(10, 1))
    ax.set_title(f"Motif Positions (First {min(10_000, len(sequence))} bases)")

    colors = plt.cm.viridis(np.linspace(0, 1, len(motif_positions)))

    for idx, (motif, positions) in enumerate(motif_positions.items()):
        sampled_positions = np.random.choice(positions, int(len(positions) * scale_factor), replace=False) \
            if scale_factor < 1 else positions

        ax.scatter(sampled_positions, [0.5] * len(sampled_positions), 
                   label=f"{motif} ({len(positions)})", 
                   color=colors[idx], s=30, alpha=0.7)

    ax.legend(loc="upper left", fontsize="small", bbox_to_anchor=(1, 1))
    ax.set_xlim(0, min(10_000, len(sequence)))
    ax.set_xticks([])
    ax.set_yticks([])

    if time.time() - start_time > 30:
        return {
            "motif_found": bool(motif_positions),
            "motif_length": motif_length,
            "filename": inputs.get("filenames", ["Unknown file"])[0],
            "execution_time": round(time.time() - start_time, 2),
            "motifs": motif_positions,
            "plot": None
        }

    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    encoded_plot = base64.b64encode(buffer.getvalue()).decode("utf-8")
    plt.close(fig)

    execution_time = round(time.time() - start_time, 2)

    valid_motifs = {
        motif: list(map(int, positions))
        for motif, positions in motif_positions.items()
        if isinstance(motif, str) and re.match(r"^[ACGT]+$", motif)
    }

    return {
        "motif_found": bool(valid_motifs),
        "motif_length": motif_length,
        "filename": inputs.get("filenames", ["Unknown file"])[0],
        "execution_time": execution_time,
        "motifs": valid_motifs,
        "plot": f"data:image/png;base64,{encoded_plot}" if encoded_plot else None,
    }
