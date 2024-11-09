import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const PopUp = ({ company, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <div className="flex items-center mb-6">
          <FontAwesomeIcon
            icon={faBuilding}
            size="2x"
            className="text-blue-500 mr-4"
          />
          <h2 className="text-3xl font-bold text-gray-800">{company.name}</h2>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-inner">
          <p className="text-gray-700 mb-2 text-xl">
            <strong>Size:</strong> {company.size}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-inner">
          <p className="text-gray-700 mb-2 text-xl">
            <strong>Industry:</strong> {company.industry}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-inner">
          <p className="text-gray-700 mb-2 text-xl">
            <strong>Locations:</strong>
          </p>
          {company.locations.map((location, index) => (
            <p key={index} className="text-gray-700 text-lg">
              {location}
            </p>
          ))}
        </div>
        <button
          onClick={(event) => onClose(event)}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopUp;
