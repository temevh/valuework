import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import PopUp from "./PopUp";

const ResultCard = ({ company, index }) => {
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  const openPopUp = () => {
    setIsPopUpVisible(true);
  };

  const closePopUp = () => {
    setIsPopUpVisible(false);
  };

  return (
    <div
      key={company}
      className="relative flex flex-row items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
    >
      <p className="text-xl text-white font-semibold flex-grow">
        {index + 1}. {company.name}
      </p>
      <button
        onClick={openPopUp}
        className="text-white hover:text-gray-400 transition duration-300"
      >
        <FontAwesomeIcon icon={faInfoCircle} size="lg" />
      </button>
      {isPopUpVisible && <PopUp company={company} onClose={closePopUp} />}
    </div>
  );
};

export default ResultCard;
