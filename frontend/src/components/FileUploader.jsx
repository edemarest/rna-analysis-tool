import { FiUpload } from "react-icons/fi";
import { useState } from "react";

function FileUploader({ onSequenceUpload }) {
  const [file, setFile] = useState(null);
  const [sequenceName, setSequenceName] = useState("");

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleUpload = (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a FASTA file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const sequenceData = e.target.result;
        const sequenceType = "RNA";

        onSequenceUpload(sequenceName || file.name, sequenceData, sequenceType);
      } catch (error) {
        alert("Failed to process the file. Please try again.");
      }
    };

    reader.onerror = () => {
      alert("Error reading the file.");
    };

    reader.readAsText(file);
  };

  return (
    <div className="container card">
      <h2 className="text-xl font-semibold text-highlight mb-4">
        Upload Sequence
      </h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          id="sequenceName"
          name="sequenceName"
          type="text"
          value={sequenceName}
          onChange={(e) => setSequenceName(e.target.value)}
          placeholder="Enter sequence name"
          className="input-field"
        />

        <div className="flex items-center gap-2">
          <input
            id="fileUpload"
            name="fileUpload"
            type="file"
            accept=".fasta"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer btn-primary flex items-center gap-2 w-full justify-center"
          >
            <FiUpload />
            {file ? file.name : "Choose File"}
          </label>
        </div>

        <button type="submit" className={file ? "btn-primary" : "btn-disabled"} disabled={!file}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default FileUploader;
