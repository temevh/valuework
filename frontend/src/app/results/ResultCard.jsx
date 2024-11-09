import { useEffect } from "react";

const ResultCard = ({ company, index }) => {
  return (
    <div key={company} className="flex flex-row gap-12">
      <p className="text-xl text-white">
        {index + 1}. {company.name}
      </p>
    </div>
  );
};

export default ResultCard;
