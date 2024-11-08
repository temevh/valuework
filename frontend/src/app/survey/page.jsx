"use client";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [data, setData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  const company = "Acme Corp";

  const questions = [
    "How satisfied are you with our service?",
    "How likely are you to recommend us to a friend?",
    "How would you rate the quality of our product?",
  ];

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const submitPress = () => {
    router.push("/results");
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className="text-2xl text-white font-bold">
          Thank you for your feedback!
        </p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => submitPress()}
        >
          Check results
        </Button>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get");
      const result = await response.json().then((data) => setData(data));
      console.log(result);
      console.log("Data fetched:", result);
      console.log("data:", data);
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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p className="text-2xl font-bold text-white">{company}</p>
      <p className="text-xl text-white">{questions[currentQuestionIndex]}</p>
      <div className="flex flex-row gap-12">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
            onClick={() => handleAnswer(num)}
            key={num}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
