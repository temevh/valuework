"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/getquestions?employee=true`
      );
      const result = await response.json();
      const formattedQuestions = result.map((item) => ({
        id: item.qId,
        question: item.q_e,
        answers: item.a_e,
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

  const handleAnswer = async (question, answer) => {
    console.log("Question:", question);
    console.log("Answer Index:", answer);

    try {
      const response = await fetch("http://localhost:5000/api/postanswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      });

      if (!response.ok) {
        throw new Error("Failed to post answer");
      }

      const result = await response.json();
      console.log("Post result:", result);

      if (currentQuestionIndex + 1 < questions.length) {
        console.log("index", currentQuestionIndex);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        Loading...
      </div>
    );
  }

  if (currentQuestionIndex == 8) {
    console.log("Finished");
    return (
      <div className="grid bg-gray-900 items-center justify-items-center min-h-screen p-8 pb-20  sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className="text-2xl mb-4">Thank you for your contribution! :)</p>
        <p>With your help we can get you awesome co-workers</p>
        <p>
          {" "}
          Your answers have been <strong>anonymously</strong> saved
        </p>
        <img
          className="w-96 h-auto"
          src="/images/sateenkaari2.png"
          alt="Sateenkaari"
        />
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
