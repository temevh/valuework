import { useEffect } from "react";

const sentimentData = {
  _id: {
    $oid: "672fc0e1fce81c12dd21152a",
  },
  name: "Accenture",
  label: [
    "company benefits",
    "company communication",
    "flexible work hours",
    "opportunities for actual professionals",
    "recognition for workers",
    "responsible management",
  ],
  "label confidence": [0.794, 0.799, 0.768, 0.776, 0.838, 0.781],
  "sentiment confidence": [0.997, 0.776, 0.991, 0.859, 0.854, 0.994],
  sentiment: [1, 0, 0, 0, 0.324, 1],
};

const SentimentData = () => {
  const data = sentimentData;

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-inner">
      <h3 className="text-xl font-bold mb-2 text-black">Company Trends</h3>
      {data.label.map((label, index) => (
        <div key={index} className="flex items-center justify-between">
          <p className="text-black text-md">{label}</p>
          <p className="text-black text-md">
            {data.sentiment[index] === 1 ? (
              <span className="text-green-500">&#9650;</span> // Green up arrow
            ) : (
              <span className="text-red-500">&#9660;</span> // Red down arrow
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SentimentData;
