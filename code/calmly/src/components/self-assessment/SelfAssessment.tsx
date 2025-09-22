"use client";

import { useState, useTransition } from "react";
import { phq9Questions, gad7Questions, answerOptions } from "./questions";
import { Loader2 } from "lucide-react";
import styles from "./SelfAssessment.module.css"; // This now works because it's in a client component
import { cn } from "@/lib/utils";
import { saveTestResult } from "./actions";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export function SelfAssessment({ user }: { user: User }) {
  const [currentTest, setCurrentTest] = useState<"phq9" | "gad7">("phq9");
  const [phq9Answers, setPhq9Answers] = useState<Record<number, number>>({});
  const [gad7Answers, setGad7Answers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [testSelected, setTestSelected] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [severity, setSeverity] = useState("");

  const [isPending, startTransition] = useTransition();

  const questions = currentTest === "phq9" ? phq9Questions : gad7Questions;
  const currentQuestion = questions[currentQuestionIndex];

  const calculateScore = (answers: Record<number, number>) => {
    return Object.values(answers).reduce((acc, val) => acc + val, 0);
  };

  const getPhq9Severity = (score: number) => {
    if (score <= 4) return "Minimal Depression";
    if (score <= 9) return "Mild Depression";
    if (score <= 14) return "Moderate Depression";
    if (score <= 19) return "Moderately Severe Depression";
    return "Severe Depression";
  };

  const getGad7Severity = (score: number) => {
    if (score <= 4) return "Minimal Anxiety";
    if (score <= 9) return "Mild Anxiety";
    if (score <= 14) return "Moderate Anxiety";
    return "Severe Anxiety";
  };

  const handleOptionClick = (value: number) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const currentAnswers = currentTest === "phq9" ? phq9Answers : gad7Answers;
    const setAnswers = currentTest === "phq9" ? setPhq9Answers : setGad7Answers;
    const allAnswersForCurrentQuestion = { ...currentAnswers, [currentQuestion.id]: selectedOption };
    setAnswers(allAnswersForCurrentQuestion);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const score = calculateScore(allAnswersForCurrentQuestion);
      const calculatedSeverity = currentTest === "phq9" ? getPhq9Severity(score) : getGad7Severity(score);
      setFinalScore(score);
      setSeverity(calculatedSeverity);
      setShowResult(true);

      startTransition(async () => {
        const result = await saveTestResult({
          type: currentTest,
          score: score,
          severity: calculatedSeverity,
          responses: allAnswersForCurrentQuestion,
        });
        if (!result.success) {
          console.error("Failed to save test results:", result.message);
        } else {
          console.log("Test results saved successfully.");
        }
      });
    }
  };

  const isLastQuestionOfAll = currentQuestionIndex === questions.length - 1;
  let severityClass = "";
  if (severity.includes("Minimal")) {
    severityClass = styles.sevGreen;
  } else if (severity.includes("Mild") || severity.includes("Moderate")) {
    severityClass = styles.sevBlue;
  } else {
    severityClass = styles.resultSev;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundBlur} />
      <div
        className={`${styles.container} max-w-3xl rounded-2xl border-1 border-gray-200 px-6 py-10 backdrop-blur-3xl sm:px-12`}
      >
        <Link href="/" className="flex flex-col items-center space-y-5">
          <Image src="/icon.png" alt="Calmly Logo" width={48} height={48} />
          <h1 className="mb-2 text-4xl font-light tracking-tight text-gray-800 select-none">Calmly</h1>
        </Link>
        <div className={`${styles.content}`}>
          {showResult ? (
            <>
              <h3 className={styles.subTitle}>
                {currentTest === "phq9" ? "PHQ-9 Screening Result" : "GAD-7 Screening Result"}
              </h3>
              <p className={styles.resultScore}>Your Score : {finalScore}</p>
              <p className={`${styles.resultSev} ${severityClass}`}>Severity: {severity}</p>
              <button
                className={`${styles.optionButton} cursor-pointer`}
                onClick={() => {
                  setTestSelected(false);
                  setShowResult(false);
                  setPhq9Answers({});
                  setGad7Answers({});
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setFinalScore(0);
                  setSeverity("");
                }}
              >
                Restart
              </button>
            </>
          ) : (
            <>
              {!testSelected ? (
                <>
                  <h3 className={styles.subTitle}>Choose a Test to Start</h3>
                  <div className={styles.optionsContainer}>
                    <button
                      className={`${styles.optionButton} cursor-pointer`}
                      onClick={() => {
                        setCurrentTest("phq9");
                        setTestSelected(true);
                      }}
                    >
                      Start PHQ-9
                    </button>
                    <button
                      className={`${styles.optionButton} cursor-pointer`}
                      onClick={() => {
                        setCurrentTest("gad7");
                        setTestSelected(true);
                      }}
                    >
                      Start GAD-7
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className={styles.subTitle}>{currentTest === "phq9" ? "PHQ-9 Screening" : "GAD-7 Screening"}</h3>
                  <p className={styles.questionText}>{currentQuestion.text}</p>
                  <p className={styles.progressText}>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                  <div className={styles.optionsContainer}>
                    {answerOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleOptionClick(option.value)}
                        className={`${styles.optionButton} ${selectedOption === option.value && styles.selected} cursor-pointer`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={selectedOption === null || isPending}
                    className={`${styles.nextButton} cursor-pointer`}
                  >
                    {isPending ? <Loader2 className="animate-spin" /> : isLastQuestionOfAll ? "FINISH" : "NEXT"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
