"use client";
import { useState } from "react";
import TriviaGame from "./components/TriviaGame";
import WordleNumerico from "./components/WordleNumerico";

export default function Page() {
  const [phase, setPhase] = useState("trivia");

  // Los dígitos base y el orden correcto ya están definidos de forma fija
  const FIXED_DIGITS = [4, 2, 7, 9, 5];
  const CORRECT_ORDER = [9, 5, 2, 7, 4];

  const handleFinish = () => {
    setPhase("puzzle");
  };

  return (
    <>
      {phase === "trivia" && <TriviaGame onFinish={handleFinish} fixedDigits={FIXED_DIGITS} />}
      {phase === "puzzle" && (
        <WordleNumerico digits={FIXED_DIGITS} correctOrder={CORRECT_ORDER} />
      )}
    </>
  );
}
