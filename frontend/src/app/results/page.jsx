"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResultCard from "./ResultCard";
import { nearestNeighbors } from "../../../../backend/nearestNeighbor"; // Import the function here

export default function Home() {
    const searchParams = useSearchParams();   
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);

    // Get answers from q1 to q8
    const answers = Array.from({ length: 8 }, (_, i) => parseInt(searchParams.get(`q${i + 1}`), 10));

    const fetchCompanies = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/getcompanies");
            if (!response.ok) throw new Error("Failed to fetch companies");

            const result = await response.json();

            // Transform company data for nearestNeighbor
            const transformedData = result.map(company => {
                const companyScores = Array.from({ length: 8 }, (_, i) => {
                    const question = company.questions[`qid${i + 1}`];
                    return question ? question.totalAnswerSum / question.totalResponses : 0;
                });
                return { name: company.name, companyScore: companyScores };
            });

            console.log("Transformed company data for NN:", transformedData); // Log the transformed data

            // Call NN function with answers and transformed data
            console.log("Calling nearestNeighbors with answers and transformed data...");
            const topCompanies = nearestNeighbors(answers, transformedData);

            console.log("Top matching companies:", topCompanies); // Log the result from nearestNeighbors
            setCompanies(topCompanies);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                Loading...
            </div>
        );

    } 

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <p className="text-2xl text-white font-bold">Best matches</p>
            {companies.map((company, index) => (
                <ResultCard company={company} index={index} key={company._id} />
            ))}
        </div>
    );
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen p-10 font-[family-name:var(--font-geist-sans)]">
      <p className="text-2xl text-gray-600 italic font-bold">Best matches</p>
      {companies.map((company, index) => (
        <ResultCard company={company} index={index} key={company._id} />
      ))}
      <button className="mt-6 px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-700 transition duration-300">
        <p className="text-xs">Show more results</p>
      </button>
    </div>
  );
}
