"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResultCard from "./ResultCard";

export default function Home() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const answers = [];
  for (let i = 1; i <= searchParams.size; i++) {
    answers.push(searchParams.get(`q${i}`));
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getcompanies");

      if (!response.ok) {
        throw new Error("Failed to post answer");
      }

      const result = await response.json();
      console.log(result);
      setCompanies(result.slice(0, 5));

      console.log(answers);
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    //NN TÄSSÄ, järjestä top 5
    //nnlgo(companies, answers);
    setLoading(false);
    //console.log(companies);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen p-10 font-[family-name:var(--font-geist-sans)]">
      <p className="text-2xl text-white font-bold">Best matches</p>
      {companies.map((company, index) => (
        <ResultCard company={company} index={index} key={company._id} />
      ))}
      <p className="pt-6 text-gray-300 italic">Show more results</p>
    </div>
  );
}
