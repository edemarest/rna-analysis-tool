RNA Sequence Analysis Tool

Overview  
This tool allows users to upload RNA sequences and perform various analyses. It supports both single and multiple sequence analyses, providing clear visualizations and statistics such as sequence length, nucleotide frequencies, and GC content distribution.

Features
- **Upload RNA sequences**: Upload your own sequence data in FASTA format.
- **Sequence statistics**: Calculate statistics like average length, nucleotide counts, and GC content.
- **Visualization**: Generate plots for sequence length distribution and nucleotide frequency.
- **Multiple sequence analysis**: Perform comparative analysis on multiple sequences.
- **Clear results**: Results are presented in a table format with visualizations for easy interpretation.

Technology Stack
- **Flask API**: Backend API built with Flask for handling sequence processing.
- **Frontend**: Vite, React, and Tailwind CSS for a fast and responsive UI.
- **Python**: Used for data processing and analysis.

Installation
1. Clone the repository:
   ```
   git clone <repo-url>
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   npm start
   ```

Usage
1. Upload an RNA sequence file (in FASTA format).
2. Select the function you want to perform on the sequence (e.g., sequence statistics, nucleotide frequencies).
3. View the results with key statistics and visualizations.