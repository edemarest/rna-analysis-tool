import { FiPlayCircle, FiActivity, FiSearch, FiGitMerge, FiLayers } from "react-icons/fi";
import "../index.css";

const iconMap = {
  FiActivity: FiActivity,
  FiSearch: FiSearch,
  FiGitMerge: FiGitMerge,
  FiLayers: FiLayers,
};

function FunctionCard({ func, onSelectFunction, isEnabled }) {
  const Icon = iconMap[func.icon] || FiPlayCircle;

  return (
    <div
      onClick={() => isEnabled && onSelectFunction(func)}
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        isEnabled ? "bg-card hover:bg-gray-700" : "bg-gray-800 opacity-50 cursor-not-allowed"
      }`}
    >
      <h3 className="text-lg font-medium flex items-center gap-2 text-textLight">
        <Icon className="text-secondary" />
        {func.name}
      </h3>
      <p className="text-sm text-textDark">{func.description}</p>
      <button
        disabled={!isEnabled}
        className={`btn w-full mt-2 flex items-center gap-2 justify-center ${
          isEnabled ? "btn-primary" : "btn-disabled"
        }`}
      >
        <FiPlayCircle />
        Run {func.name}
      </button>
    </div>
  );
}

export default FunctionCard;
