import { useState, useRef } from "react";
import { FaDna } from "react-icons/fa";
import FileUploader from "./components/FileUploader";
import SequenceList from "./components/SequenceList";
import RNAFunctionGrid from "./components/RNAFunctionGrid";
import FunctionConfig from "./components/FunctionConfig";
import FunctionResults from "./components/FunctionResults";
import functionData from "./data/functions.json";
import {
  handleSequenceUpload,
  handleSelectSequence,
  handleFunctionSelect,
  handleBackToFunctions,
  handleRunFunction
} from "./utils/handlers";
import "./index.css";

function App() {
  const [sequences, setSequences] = useState([]);
  const [selectedSequences, setSelectedSequences] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionResults, setFunctionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const resultsRef = useRef(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="container grid grid-cols-[1fr_2fr] gap-8">
        <div className="flex flex-col gap-6">
          <FileUploader onSequenceUpload={(name, data) => handleSequenceUpload(name, data, setSequences)} />
          <SequenceList sequences={sequences} onSelect={(seq) => handleSelectSequence(seq, setSelectedSequences, setSelectedFunction, setShowConfig)} />
        </div>
        <div className="flex flex-col gap-6">
          {!showConfig ? (
            <>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaDna className="text-secondary" />
                Select RNA Function
              </h2>
              <RNAFunctionGrid
                selectedSequences={selectedSequences}
                onFunctionSelect={(func) => handleFunctionSelect(func, setSelectedFunction, setShowConfig)}
              />
            </>
          ) : (
            <>
              <FunctionConfig
                selectedFunction={selectedFunction}
                onBack={() => handleBackToFunctions(setSelectedFunction, setShowConfig)}
                onRunFunction={(inputs) =>
                  handleRunFunction(
                    selectedFunction,
                    selectedSequences,
                    inputs,
                    setIsLoading,
                    setFunctionResults,
                    functionData,
                    resultsRef
                  )
                }
              />
            </>
          )}
          <div ref={resultsRef}>
            <FunctionResults functionData={functionResults} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
