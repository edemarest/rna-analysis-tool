import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import "../index.css";

function FunctionConfig({ selectedFunction, onBack, onRunFunction }) {
  const [inputValues, setInputValues] = useState(
    selectedFunction.inputs.reduce((acc, input) => {
      acc[input.label] = input.type === "select" ? input.options[0] : "";
      return acc;
    }, {})
  );

  const handleInputChange = (e, label) => {
    let value = e.target.value;
    if (!isNaN(value) && value.trim() !== "") {
      value = Number(value);
    }
    setInputValues((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitizedInputs = {};

    Object.entries(inputValues).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || Array.isArray(value)) {
        sanitizedInputs[key] = value;
      }
    });

    if (selectedFunction.name === "Predict Structure") {
      if (sanitizedInputs["Energy Cutoff"] === "" || sanitizedInputs["Energy Cutoff"] === null) {
        delete sanitizedInputs["Energy Cutoff"];
      } else {
        const energyCutoffValue = parseFloat(sanitizedInputs["Energy Cutoff"]);
        if (isNaN(energyCutoffValue)) {
          alert("Energy Cutoff must be a valid number.");
          return;
        }
        sanitizedInputs["Energy Cutoff"] = energyCutoffValue;
      }
    }

    onRunFunction(sanitizedInputs);
  };

  return (
    <div className="container card">
      <button onClick={onBack} className="flex items-center gap-2 text-textLight">
        <FiArrowLeft />
        Back to Function Selection
      </button>
      <h2 className="text-lg font-semibold flex items-center gap-2 text-textLight mt-4">
        {selectedFunction.name}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedFunction.inputs.map((input, index) => (
          <div key={index}>
            <label className="text-textLight">{input.label}</label>
            {input.type === "select" ? (
              <select
                className="input-field"
                value={inputValues[input.label]}
                onChange={(e) => handleInputChange(e, input.label)}
              >
                {input.options.map((option, idx) => (
                  <option key={idx}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={input.type}
                placeholder={input.placeholder}
                className="input-field"
                value={inputValues[input.label]}
                onChange={(e) => handleInputChange(e, input.label)}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className={`btn-primary w-full mt-4 ${
            Object.entries(inputValues).some(
              ([key, val]) => val === "" && key !== "Energy Cutoff"
            )
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={
            Object.entries(inputValues).some(
              ([key, val]) => val === "" && key !== "Energy Cutoff"
            )
          }
        >
          Run {selectedFunction.name}
        </button>
      </form>
    </div>
  );
}

export default FunctionConfig;
