"use client";
import { useState } from "react";

const QUESTIONS = [
  {
    q: "¿Qué animal puede regenerar un brazo?",
    pattern: "^pulpo$",
  },
  {
    q: "¿Qué fruta tiene las semillas por fuera?",
    pattern: "^fresa$",
  },
  {
    q: "¿Qué metal es líquido a temperatura ambiente?",
    pattern: "^mercurio$",
  },
  {
    q: "¿Qué ciudad colombiana es llamada la 'ciudad de la eterna primavera'?",
    pattern: "^medell[ií]n$",
  },
  {
    q: "¿Qué animal nocturno, símbolo de la sabiduría, tiene grandes ojos?",
    pattern: "^b[uú]ho$",
  },
];

function normalizeText(s) {
  if (!s) return "";
  return s.trim().toLowerCase();
}

function matchesRegex(input, pattern) {
  const normalized = normalizeText(input);
  const re = new RegExp(pattern, "i");
  return re.test(normalized);
}

export default function TriviaGame({ onFinish, fixedDigits }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [digits, setDigits] = useState([]);
  const [feedback, setFeedback] = useState({ text: "", isCorrect: false });

  const q = QUESTIONS[index];

  const handleSubmit = () => {
    if (matchesRegex(input, q.pattern)) {
      const newDigits = [...digits, fixedDigits[index]];
      setDigits(newDigits);
      setFeedback({ text: "CORRECTO", isCorrect: true });
      
      setTimeout(() => {
        setFeedback({ text: "", isCorrect: false });
        setInput("");
        if (index + 1 < QUESTIONS.length) {
          setIndex(index + 1);
        } else {
          onFinish?.();
        }
      }, 700);
    } else {
      setFeedback({ text: "INCORRECTO", isCorrect: false });
      setTimeout(() => setFeedback({ text: "", isCorrect: false }), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-light mb-2 text-white">
            TRIVIA
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            Nivel {index + 1} de 5
          </p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-8 mb-6">
          <p className="text-lg font-light mb-6 text-center leading-relaxed">
            {q.q}
          </p>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 bg-black border border-neutral-700 text-white text-center font-light focus:outline-none focus:border-neutral-500"
            placeholder="Tu respuesta"
          />
          
          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-3 bg-neutral-900 border border-neutral-700 text-white font-light hover:bg-neutral-800"
          >
            ENVIAR
          </button>
          
          {feedback.text && (
            <div className={`mt-4 py-2 text-center text-sm font-light border ${
              feedback.isCorrect 
                ? "border-green-700 text-green-600" 
                : "border-red-700 text-red-600"
            }`}>
              {feedback.text}
            </div>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-xs text-neutral-500 uppercase tracking-wider mb-3">
            Dígitos obtenidos
          </h2>
          <div className="flex gap-1 justify-center">
            {digits.length > 0 ? (
              digits.map((d, i) => (
                <div
                  key={i}
                  className="w-10 h-10 flex items-center justify-center bg-neutral-900 border border-neutral-700 text-white font-light"
                >
                  {d}
                </div>
              ))
            ) : (
              <p className="text-neutral-600 text-sm">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}