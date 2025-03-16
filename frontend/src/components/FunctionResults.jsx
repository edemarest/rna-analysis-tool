import { FiLoader, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import "../index.css";

const renderFunctionOutput = (functionData) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-md font-medium text-textLight">Function Results</h3>
        <table className="w-full border-collapse border border-gray-700 text-textLight mt-4">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2">Metric</th>
              <th className="border border-gray-700 px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-700">
              <td className="border border-gray-700 px-4 py-2">Filename</td>
              <td className="border border-gray-700 px-4 py-2">{functionData.results.filename}</td>
            </tr>
            <tr className="border border-gray-700">
              <td className="border border-gray-700 px-4 py-2">Average Length</td>
              <td className="border border-gray-700 px-4 py-2">{functionData.results.average_length}</td>
            </tr>
            <tr className="border border-gray-700">
              <td className="border border-gray-700 px-4 py-2">GC Content</td>
              <td className="border border-gray-700 px-4 py-2">{functionData.results.gc_content}</td>
            </tr>
            <tr className="border border-gray-700">
              <td className="border border-gray-700 px-4 py-2">AT Content</td>
              <td className="border border-gray-700 px-4 py-2">{functionData.results.at_content}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-6">
        {functionData.results.nucleotide_plot && (
          <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-center">
            <img
              src={functionData.results.nucleotide_plot}
              alt="Nucleotide Frequency"
              className="max-w-full h-auto rounded-md border border-gray-700 shadow-lg"
            />
          </div>
        )}
        {functionData.results.gc_content_plot && (
          <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-center">
            <img
              src={functionData.results.gc_content_plot}
              alt="GC Content"
              className="max-w-full h-auto rounded-md border border-gray-700 shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

function FunctionResults({ functionData, isLoading }) {
  if (isLoading) {
    return (
      <div className="card flex items-center gap-3 text-yellow-400">
        <FiLoader className="animate-spin text-2xl" />
        <p>Processing function... Please wait.</p>
      </div>
    );
  }

  if (!functionData || functionData.error) {
    return (
      <div className="card flex items-center gap-3 text-textDark">
        <FiAlertTriangle className="text-yellow-500 text-2xl" />
        <p className="text-yellow-500">{functionData?.error || "No results available."}</p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-textLight">
        <FiCheckCircle className="text-green-500" />
        Function Results
      </h2>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-md font-medium text-textLight">Summary</h3>
        <p className="text-textDark"><strong>Filename:</strong> {functionData.results.filename}</p>
      </div>
      {renderFunctionOutput(functionData)}
    </div>
  );
}

export default FunctionResults;
