import { useState } from "react";
import { FiLoader, FiAlertTriangle, FiCheckCircle, FiZoomIn } from "react-icons/fi";
import "../index.css";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const renderFunctionOutput = (functionData, openModal) => {
  switch (functionData.function) {
    case "Predict Structure":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-md font-medium text-textLight">RNA Structure Prediction</h3>
            <table className="w-full border-collapse border border-gray-700 text-textLight mt-4">
              <tbody>
                <tr className="border border-gray-700">
                  <td className="border border-gray-700 px-4 py-2">Minimum Free Energy (MFE)</td>
                  <td className="border border-gray-700 px-4 py-2">{functionData.results.mfe} kcal/mol</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4">
              <a
                href={`${API_BASE_URL}/output/${functionData.results.dot_structure_file}`}
                className="text-blue-400 hover:text-blue-500"
                download
              >
                Download Dot-Bracket Structure (.txt)
              </a>
            </div>
          </div>

          <div className="relative bg-gray-900 p-4 rounded-lg flex items-center justify-center">
            <img
              src={functionData.results.plot} 
              alt="RNA Secondary Structure"
              className="max-w-full h-auto rounded-md border border-gray-700 shadow-lg bg-white"
            />
            
            <button
              onClick={openModal}
              className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition duration-200 shadow-md"
              title="Zoom In"
            >
              <FiZoomIn size={20} />
            </button>
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-md font-medium text-textLight">No Visualization Available</h3>
          <p className="text-textDark">Results could not be formatted for this function.</p>
        </div>
      );
  }
};

function FunctionResults({ functionData, isLoading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        <p className="text-textDark"><strong>Function:</strong> {functionData.function}</p>
      </div>
      {renderFunctionOutput(functionData, openModal)}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg relative w-[80%] max-w-4xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition duration-200"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">Zoomed RNA Structure</h2>
            
            <Zoom>
              <img
                src={functionData.results.plot}
                alt="Zoomed RNA Secondary Structure"
                className="max-w-full h-auto rounded-md border border-gray-700 shadow-lg bg-white"
              />
            </Zoom>
          </div>
        </div>
      )}
    </div>
  );
}

export default FunctionResults;
