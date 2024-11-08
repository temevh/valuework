"use client";
import Button from "@mui/material/Button";
import React, { useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

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
      <p className="text-xl text-white">Survey page</p>
      <button onClick={fetchData} className="btn">
        Fetch data
      </button>
      <button onClick={postData} className="btn">
        Post data
      </button>
      {data && (
        <div className="text-white text-xl">
          <p>Random Number: {data[4].randNum}</p>
        </div>
      )}
    </div>
  );
}
