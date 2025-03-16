import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import "../index.css";

function SequenceList({ sequences, onSelect }) {
  const [selectedSequences, setSelectedSequences] = useState([]);

  const handleSelect = (sequence) => {
    setSelectedSequences((prev) => {
      if (prev.includes(sequence)) {
        return prev.filter((s) => s !== sequence);
      } else if (prev.length < 2) {
        return [...prev, sequence];
      }
      return prev;
    });
  
    onSelect(sequence);
  };

  return (
    <div className="container card">
      <h2 className="text-lg font-semibold text-textLight mb-4">My Sequences</h2>

      <div className="max-h-72 overflow-y-auto border border-gray-600 p-4 rounded-md bg-card">
        {sequences.length === 0 ? (
          <p className="text-textDark text-sm">No sequences uploaded.</p>
        ) : (
          sequences.map((seq, index) => {
            const isSelected = selectedSequences.some((s) => s.name === seq.name);

            return (
              <div
                key={index}
                onClick={() => handleSelect(seq)}
                className={`cursor-pointer p-4 mb-2 rounded-lg border flex items-center justify-between transition-all shadow-md ${
                  isSelected
                    ? "bg-secondary border-secondary text-white"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700 text-textLight"
                }`}
              >
                <div>
                  <strong className="text-lg">{seq.name}</strong>
                  <small className="text-textDark ml-2">({seq.type})</small>
                  <div className="text-xs text-textDark mt-1">
                    {seq.data.slice(0, 15)}...
                  </div>
                </div>
                {isSelected && (
                  <FiCheckCircle className="text-success text-2xl" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SequenceList;
