"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const companies = ["Accenture", "Deloitte", "KPMG", "PwC"];
  const percentages = [90, 85, 80, 75];

  const answers = [];
  for (let i = 1; i <= searchParams.size; i++) {
    answers.push(searchParams.get(`q${i}`));
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p className="text-2xl text-white font-bold">Best matches</p>
      {companies.map((company, index) => (
        <div key={company} className="flex flex-row gap-12">
          <p className="text-xl text-white">
            {index + 1}. {company} {percentages[index]}
          </p>
        </div>
      ))}
    </div>
  );
}
