import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const PopUp = ({ company, onClose }) => {
  useEffect(() => {
    console.log("PopUp loaded with company:", company);
  }, [company]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center bg-black bg-opacity-50 pt-10 z-50">
      <div className="bg-listbackground p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faBuilding}
            size="2x"
            className="text-gray-800 mr-4"
          />
          <h2 className="text-2xl font-bold text-black italic">
            {company.name}
          </h2>
        </div>
        <div className="bg-listitem p-4 rounded-lg mb-4">
          <p className="text-black mb-2 text-xl">
            <strong>Size:</strong> {company.size}
          </p>
        </div>
        <div className="bg-listitem p-4 rounded-lg mb-4">
          <p className="text-black mb-2 text-xl">
            <strong>Industry:</strong> {company.industry}
          </p>
        </div>
        <div className="bg-listitem p-4 rounded-lg mb-4">
          <p className="text-black text-xl">
            <strong>Locations:</strong>
          </p>
          {company.locations.map((location, index) => (
            <p key={index} className="text-black text-lg">
              {location}
            </p>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopUp;
