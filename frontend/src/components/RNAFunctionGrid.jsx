import FunctionCard from "./FunctionCard";
import functionData from "../data/functions.json";
import "../index.css";

function RNAFunctionGrid({ selectedSequences, onFunctionSelect }) {
  const isSingleSequenceEnabled = selectedSequences.length === 1;
  const isMultiSequenceEnabled = selectedSequences.length === 2;

  return (
    <div className="container card">
      <h3 className="text-md font-semibold mt-4 text-textLight">Single Sequence Functions</h3>
      <div className="grid grid-cols-2 gap-4">
        {functionData.singleSequence.map((func) => (
          <FunctionCard
            key={func.name}
            func={func}
            onSelectFunction={onFunctionSelect}
            isEnabled={isSingleSequenceEnabled}
          />
        ))}
      </div>

      {/* 🔹 MULTIPLE-SEQUENCE FUNCTIONS */}
      <h3 className="text-md font-semibold mt-6 text-textLight">Multiple Sequence Functions</h3>
      <div className="grid grid-cols-2 gap-4">
        {functionData.multiSequence.map((func) => (
          <FunctionCard
            key={func.name}
            func={func}
            onSelectFunction={onFunctionSelect}
            isEnabled={isMultiSequenceEnabled}
          />
        ))}
      </div>
    </div>
  );
}

export default RNAFunctionGrid;
