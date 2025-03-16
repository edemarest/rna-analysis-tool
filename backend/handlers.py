from functions.predict_structure import predict_structure
from functions.motif_search import motif_search
from functions.splice_site import predict_splice_sites
from functions.stability import calculate_stability
from functions.half_life import predict_half_life
from functions.multi_seq_align import multi_sequence_alignment
from functions.clustering import cluster_sequences
from functions.struct_similarity import compare_structures
from functions.motif_co_occurrence import find_motif_co_occurrences
from functions.evolutionary_distance import calculate_distance
from functions.sequence_statistics import sequence_statistics

FUNCTION_HANDLERS = {
    "predict_structure": predict_structure,
    "motif_search": motif_search,
    "splice_site_prediction": predict_splice_sites,
    "rna_folding_stability": calculate_stability,
    "rna_half_life_prediction": predict_half_life,
    "multiple_sequence_alignment": multi_sequence_alignment,
    "rna_sequence_clustering": cluster_sequences,
    "structural_similarity": compare_structures,
    "motif_co_occurrence_analysis": find_motif_co_occurrences,
    "rna_evolutionary_distance_calculation": calculate_distance,
    "sequence_statistics": sequence_statistics
}

