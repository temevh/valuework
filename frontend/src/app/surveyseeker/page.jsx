"use client";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/getquestions?employee=false"
      );
      const result = await response.json();
      const formattedQuestions = result.map((item) => ({
        id: item.qId,
        question: item.q_s,
        answers: item.a_s,
      }));
      setQuestions(formattedQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (index) => {
    console.log(index + 1);
    setAnswers([...answers, index + 1]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const submitPress = () => {
    const queryString = answers
      .map((answer, index) => `q${index + 1}=${answer}`)
      .join("&");
    router.push(`/results?${queryString}`);
  };

  if (loading) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        Loading...
      </div>
    );
  }

  if (currentQuestionIndex == 8) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Button variant="contained" color="secondary" onClick={submitPress}>
          Check results
        </Button>
      </div>
    );
  }
  return (
    <div className="grid bg-gray-900 items-center justify-items-center min-h-screen p-8 gap-4 sm:p-48 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-2">
        <p className="text-3xl text-white text-center">
          {questions[currentQuestionIndex].question}
        </p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-2">
        <div className="flex space-x-4">
          {questions[currentQuestionIndex].answers.map((option, index) => (
            <button
              key={index}
              onClick={() =>
                handleAnswer(questions[currentQuestionIndex], index + 1)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 font-bold transition duration-300"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
