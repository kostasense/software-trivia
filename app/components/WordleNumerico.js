"use client";
import { useState } from "react";

export default function WordleNumerico({ digits, correctOrder }) {
  const [attempts, setAttempts] = useState(Array(6).fill(null));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState({});

  function handleKeyPress(key) {
    if (gameOver) return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "DELETE") {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      if (currentGuess.includes(key)) {
        setMessage("Dígito ya usado");
        setTimeout(() => setMessage(""), 1000);
        return;
      }
      setCurrentGuess(prev => [...prev, key]);
    }
  }

  function submitGuess() {
    if (currentGuess.length !== 5) {
      setMessage("Ingresa 5 dígitos");
      setTimeout(() => setMessage(""), 1500);
      return;
    }

    const uniqueDigits = new Set(currentGuess);
    if (uniqueDigits.size !== 5) {
      setMessage("No repetir dígitos");
      setTimeout(() => setMessage(""), 1500);
      return;
    }

    const feedback = currentGuess.map((digit, i) => {
      if (digit === String(correctOrder[i])) return "correct";
      if (correctOrder.includes(Number(digit))) return "present";
      return "absent";
    });

    const newKeyboardStatus = { ...keyboardStatus };
    currentGuess.forEach((digit, i) => {
      const status = feedback[i];
      if (!newKeyboardStatus[digit] || 
          (status === "correct") || 
          (status === "present" && newKeyboardStatus[digit] !== "correct")) {
        newKeyboardStatus[digit] = status;
      }
    });
    setKeyboardStatus(newKeyboardStatus);

    const newAttempts = [...attempts];
    newAttempts[currentRow] = { guess: currentGuess, feedback };
    setAttempts(newAttempts);

    if (currentGuess.join("") === correctOrder.join("")) {
      setMessage("Correcto");
      setGameOver(true);
      return;
    }

    if (currentRow >= 5) {
      setGameOver(true);
      return;
    }

    setCurrentRow(currentRow + 1);
    setCurrentGuess([]);
  }

  function renderGrid() {
    return Array(6).fill(null).map((_, rowIndex) => {
      const isCurrentRow = rowIndex === currentRow && !gameOver;
      const attempt = attempts[rowIndex];

      return (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {Array(5).fill(null).map((_, colIndex) => {
            let content = "";
            let bgClass = "bg-neutral-900 border-neutral-700";

            if (attempt) {
              content = attempt.guess[colIndex];
              const feedback = attempt.feedback[colIndex];
              bgClass = feedback === "correct" ? "bg-green-700 border-green-700 text-white" :
                       feedback === "present" ? "bg-neutral-600 border-neutral-600 text-white" :
                       "bg-neutral-800 border-neutral-800 text-neutral-400";
            } else if (isCurrentRow && currentGuess[colIndex]) {
              content = currentGuess[colIndex];
              bgClass = "bg-neutral-900 border-neutral-500 text-white";
            }

            return (
              <div
                key={colIndex}
                className={`w-12 h-12 border flex items-center justify-center text-xl font-light ${bgClass}`}
              >
                {content}
              </div>
            );
          })}
        </div>
      );
    });
  }

  function renderKeyboard() {
    return (
      <div className="space-y-2">
        <div className="flex gap-1 justify-center">
          {digits.map(digit => {
            const strDigit = String(digit);
            const isUsedInCurrentGuess = currentGuess.includes(strDigit);
            const isDisabled = isUsedInCurrentGuess && !gameOver;
            
            return (
              <button
                key={digit}
                onClick={() => !isDisabled && handleKeyPress(strDigit)}
                disabled={isDisabled}
                className={`w-10 h-10 text-sm font-light border transition-all ${
                  isDisabled ? "bg-neutral-950 border-neutral-800 text-neutral-600 cursor-not-allowed" :
                  keyboardStatus[strDigit] === "correct" ? "bg-green-700 border-green-700 text-white" :
                  keyboardStatus[strDigit] === "present" ? "bg-neutral-600 border-neutral-600 text-white" :
                  keyboardStatus[strDigit] === "absent" ? "bg-neutral-800 border-neutral-800 text-neutral-500" :
                  "bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                }`}
              >
                {digit}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleKeyPress("DELETE")}
            className="px-3 py-2 bg-neutral-900 border border-neutral-700 text-white text-xs font-light hover:bg-neutral-800"
          >
            BORRAR
          </button>
          <button
            onClick={() => handleKeyPress("ENTER")}
            className="px-4 py-2 bg-neutral-900 border border-neutral-700 text-white text-xs font-light hover:bg-neutral-800"
          >
            ENTER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light mb-1 text-white">
            CÓDIGO NUMÉRICO
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            5 dígitos distintos · 6 intentos
          </p>
        </div>

        <div className="space-y-1 mb-8">
          {renderGrid()}
        </div>

        {message && (
          <div className="text-center mb-4">
            <p className="text-sm font-light text-neutral-300">{message}</p>
          </div>
        )}

        <div className="bg-neutral-950 p-4">
          {renderKeyboard()}
        </div>

        {gameOver && (
          <button
            onClick={() => {
              setAttempts(Array(6).fill(null));
              setCurrentRow(0);
              setCurrentGuess([]);
              setGameOver(false);
              setMessage("");
              setKeyboardStatus({});
            }}
            className="w-full mt-4 py-2 bg-neutral-900 border border-neutral-700 text-white text-sm font-light hover:bg-neutral-800"
          >
            REINICIAR
          </button>
        )}
      </div>
    </div>
  );
}