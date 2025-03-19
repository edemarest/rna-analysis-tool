import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import io
import base64
import time
import seaborn as sns
import collections

def sequence_statistics(inputs):
    start_time = time.time()

    sequences = inputs.get("sequences", [])
    filenames = inputs.get("filenames", ["Unknown file"])

    if not sequences:
        return {"error": "No sequences provided"}

    sequence_lengths = [len(seq) for seq in sequences]
    total_sequences = len(sequences)

    nucleotide_counts = collections.Counter("".join(sequences))
    valid_nucleotides = {"A", "C", "G", "T", "U"}
    nucleotide_counts = {k: v for k, v in nucleotide_counts.items() if k in valid_nucleotides}

    gc_content = (nucleotide_counts.get("G", 0) + nucleotide_counts.get("C", 0)) / sum(nucleotide_counts.values()) * 100
    at_content = (nucleotide_counts.get("A", 0) + nucleotide_counts.get("T", 0)) / sum(nucleotide_counts.values()) * 100

    fig, ax = plt.subplots(figsize=(6, 4))
    sns.histplot(sequence_lengths, bins=20, kde=True, ax=ax, color="blue")
    ax.set_title("Sequence Length Distribution")
    ax.set_xlabel("Sequence Length")
    ax.set_ylabel("Count")

    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    length_distribution_plot = base64.b64encode(buffer.getvalue()).decode("utf-8")
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(5, 3))
    sns.barplot(x=list(nucleotide_counts.keys()), y=list(nucleotide_counts.values()), ax=ax, palette="viridis")
    ax.set_title("Nucleotide Frequency")
    ax.set_xlabel("Nucleotide")
    ax.set_ylabel("Count")

    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    nucleotide_plot = base64.b64encode(buffer.getvalue()).decode("utf-8")
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(5, 3))
    sns.kdeplot([gc_content] * len(sequences), ax=ax, shade=True, color="green")
    ax.set_title("GC Content Distribution")
    ax.set_xlabel("GC Content (%)")
    ax.set_ylabel("Density")

    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    gc_content_plot = base64.b64encode(buffer.getvalue()).decode("utf-8")
    plt.close(fig)

    execution_time = round(time.time() - start_time, 2)

    return {
        "total_sequences": total_sequences,
        "average_length": round(np.mean(sequence_lengths), 2) if sequence_lengths else 0,
        "gc_content": round(gc_content, 2),
        "at_content": round(at_content, 2),
        "nucleotide_counts": nucleotide_counts,
        "length_distribution_plot": f"data:image/png;base64,{length_distribution_plot}",
        "nucleotide_plot": f"data:image/png;base64,{nucleotide_plot}",
        "gc_content_plot": f"data:image/png;base64,{gc_content_plot}",
        "execution_time": execution_time,
        "filename": filenames[0],
    }
