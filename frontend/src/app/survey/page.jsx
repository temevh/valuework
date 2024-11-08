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
      const response = await fetch("http://localhost:5000/api/getquestions");
      const result = await response.json();
      const formattedQuestions = result.map((q) => ({
        question: q.title,
        answers: q.options,
      }));
      setQuestions(formattedQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const postData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          randNum: Math.floor(Math.random() * 100),
        }),
      });
      const result = await response.json();
      console.log("Data posted:", result);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const submitPress = () => {
    const queryString = answers
      .map((answer, index) => `q${index + 1}=${answer}`)
      .join("&");
    router.push(`/results?${queryString}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Button variant="contained" color="primary" onClick={submitPress}>
          Check results
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p className="text-xl text-white">
        {questions[currentQuestionIndex].question}
      </p>
      <div className="flex space-x-4">
        {questions[currentQuestionIndex].answers.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
