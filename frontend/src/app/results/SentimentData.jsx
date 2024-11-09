import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const sentimentData = {
  _id: {
    $oid: "672fc0e1fce81c12dd21152a",
  },
  name: "Accenture",
  label: [
    "Company benefits",
    "Company communication",
    "Flexible work hours",
    "Opportunities for actual professionals",
    "Recognition for workers",
    "Responsible management",
  ],
  "label confidence": [0.794, 0.799, 0.768, 0.776, 0.838, 0.781],
  "sentiment confidence": [0.997, 0.776, 0.991, 0.859, 0.854, 0.994],
  sentiment: [1, 0, 0, 0, 0.324, 1],
};

const SentimentData = () => {
  const data = sentimentData;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-inner">
      <div className="flex flex-row">
        <h3 className="text-xl font-bold mb-2 text-black">Company Trends</h3>
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="text-gray-500 ml-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        {isHovered && (
          <div className="absolute top-0 w-48 left-100 mt-6 ml-8 p-2 bg-white border border-gray-300 rounded shadow-lg">
            <p className="text-gray-700 text-sm">
              The trend overview is based on news analysed by AI and ML models
            </p>
          </div>
        )}
      </div>
      {data.label.map((label, index) => (
        <div key={index} className="flex items-center justify-between">
          <p className="text-black text-md">{label}</p>
          <p className="text-black text-md">
            {data.sentiment[index] === 1 ? (
              <span className="text-green-500">&#9650;</span>
            ) : (
              <span className="text-red-500">&#9660;</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SentimentData;
