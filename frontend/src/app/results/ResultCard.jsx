import { useState } from "react";
import PopUp from "./PopUp";

const ResultCard = ({ company, index }) => {
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  const openPopUp = () => {
    setIsPopUpVisible(true);
  };

  const closePopUp = (event) => {
    event.stopPropagation();
    setIsPopUpVisible(false);
  };

  return (
    <div
      key={company.name}
      onClick={openPopUp}
      className="relative flex flex-row items-center gap-4 p-4 bg-listitem rounded-lg shadow-md hover:bg-green-600 transition duration-300 cursor-pointer"
    >
      <p className="text-xl text-gray-800 font-semibold flex-grow">
        {index + 1}. {company.name}
      </p>
      {isPopUpVisible && <PopUp company={company} onClose={closePopUp} />}
    </div>
  );
};

export default ResultCard;
