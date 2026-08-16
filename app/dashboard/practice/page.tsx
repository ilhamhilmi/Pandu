"use client";

import React, { useState } from "react";
import {
  FiTarget,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { IoExtensionPuzzle } from "react-icons/io5";
import PageHeader from "@/components/dashboard/page-header";
import EmptyState from "@/components/dashboard/empty-state";
import ErrorState from "@/components/dashboard/error-state";

interface PracticeQuestion {
  id: number;
  code: string;
  language?: string;
  instruction?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type Phase = "idle" | "loading" | "practice" | "done" | "error";

function CodeBlock({
  code,
  fill,
  submitted,
  correct,
}: {
  code: string;
  fill: string | null;
  submitted: boolean;
  correct: boolean | null;
}) {
  const parts = code.split("____");
  return (
    <pre className="font-inter text-sm sm:text-base leading-relaxed whitespace-pre-wrap bg-slate-900 text-slate-100 rounded-xl p-4 sm:p-5 overflow-x-auto">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span
              className={
                submitted
                  ? correct
                    ? "bg-emerald-500/30 text-emerald-300 rounded px-1"
                    : "bg-red-500/30 text-red-300 rounded px-1 line-through decoration-red-400 decoration-2"
                  : "bg-amber-400/30 text-amber-300 rounded px-1 animate-pulse"
              }
            >
              {fill ?? "____"}
            </span>
          )}
        </React.Fragment>
      ))}
    </pre>
  );
}

export default function PracticePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [goal, setGoal] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);

  async function startPractice() {
    setInitializing(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-practice", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat soal latihan.");
      }

      setGoal(data.data.goal);
      setQuestions(data.data.questions);
      setCurrentIndex(0);
      setSelectedIndex(null);
      setSubmitted(false);
      setResults([]);
      setPhase("practice");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal membuat soal latihan.";
      if (msg.includes("onboarding")) {
        setError(msg);
        setPhase("idle");
      } else {
        setError(msg);
        setPhase("error");
      }
    } finally {
      setInitializing(false);
    }
  }

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const score = results.filter(Boolean).length;

  // ===== IDLE / LOADING =====
  if (phase === "idle" || phase === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader
          title="Latihan"
          description="Uji pemahamanmu dengan melengkapi sintaks yang rumpang. Soal dibuat khusus berdasarkan goal belajarmu."
        />

        {initializing ? (
          <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center gap-4 mt-4">
              <FiRefreshCw className="h-10 w-10 text-primary animate-spin" />
              <p className="font-inter text-sm text-muted-foreground">
                Tunggu ya, AI lagi buatin soal latihan khusus buat kamu...
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<IoExtensionPuzzle className="h-10 w-10 text-primary" />}
            title="Siap Latihan?"
            description={`Klik tombol di bawah untuk memulai. AI akan membuat 5-10 soal "Syntax Puzzle" untuk melengkapi sintaks yang rumpang, disesuaikan dengan goal belajarmu${
              goal ? `: "${goal}"` : ""
            }.`}
            actionLabel="Mulai latihan"
            onAction={startPractice}
          />
        )}

        {error && phase === "idle" && (
          <div className="mt-4">
            <ErrorState
              message={error}
              onRetry={error.includes("onboarding") ? undefined : startPractice}
            />
          </div>
        )}
      </div>
    );
  }

  // ===== ERROR =====
  if (phase === "error") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Latihan" />
        <ErrorState message={error || "Terjadi kesalahan"} onRetry={startPractice} />
      </div>
    );
  }

  // ===== DONE =====
  if (phase === "done") {
    const correctCount = score;
    const total = questions.length;
    const percent = Math.round((correctCount / Math.max(total, 1)) * 100);
    const isPerfect = correctCount === total;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Latihan" />

        <div className="bg-white rounded-xl border border-border p-8 sm:p-10 text-center">
          <div className="mb-4">
            {isPerfect ? (
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <FiCheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <FiTarget className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>

          <h2 className="font-inter text-2xl font-bold text-foreground mb-2">
            Latihan Selesai!
          </h2>
          <p className="font-inter text-sm text-muted-foreground mb-6">
            Kamu berhasil menjawab{" "}
            <span className="font-semibold text-foreground">
              {correctCount} dari {total}
            </span>{" "}
            soal ({percent}%).
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
            <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
              <p className="font-inter text-2xl font-bold text-emerald-600">
                {correctCount}
              </p>
              <p className="font-inter text-xs text-muted-foreground">Benar</p>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-100 p-4">
              <p className="font-inter text-2xl font-bold text-red-500">
                {total - correctCount}
              </p>
              <p className="font-inter text-xs text-muted-foreground">Salah</p>
            </div>
          </div>

          <button
            onClick={startPractice}
            disabled={initializing}
            className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60"
          >
            {initializing ? (
              <>
                <FiRefreshCw className="h-4 w-4 animate-spin" />
                Membuat soal baru...
              </>
            ) : (
              <>
                Latihan lagi
                <FiArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ===== PRACTICE =====
  const isCorrect =
    submitted && selectedIndex !== null
      ? selectedIndex === currentQuestion.correctIndex
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHeader
        title="Latihan"
        description={goal ? `Latihan untuk goal: "${goal}"` : undefined}
      />

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-inter text-sm font-semibold text-foreground">
          Soal {currentIndex + 1} dari {questions.length}
        </p>
        <p className="font-inter text-xs text-muted-foreground">
          Benar: {score}
        </p>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + (submitted ? 1 : 0)) / Math.max(questions.length, 1)) * 100}%`,
          }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl border border-border p-5 sm:p-6">
        {currentQuestion.language && (
          <span className="font-inter inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary rounded-full px-3 py-1 mb-4">
            <FiTarget className="h-3.5 w-3.5" />
            {currentQuestion.language}
          </span>
        )}

        {currentQuestion.instruction && (
          <p className="font-inter text-sm text-foreground mb-4">
            {currentQuestion.instruction}
          </p>
        )}

        <CodeBlock
          code={currentQuestion.code}
          fill={
            selectedIndex !== null
              ? currentQuestion.options[selectedIndex]
              : null
          }
          submitted={submitted}
          correct={isCorrect}
        />

        {/* Options */}
        <div className="mt-5 space-y-2.5">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedIndex === i;
            const isCorrectOption = i === currentQuestion.correctIndex;

            let optionStyle =
              "border-border text-foreground hover:border-primary hover:bg-primary/5";
            if (submitted) {
              if (isCorrectOption) {
                optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-700";
              } else if (isSelected && !isCorrectOption) {
                optionStyle = "border-red-500 bg-red-50 text-red-600";
              } else {
                optionStyle =
                  "border-border text-muted-foreground opacity-70";
              }
            } else if (isSelected) {
              optionStyle = "border-primary bg-primary/10 text-primary";
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelectedIndex(i)}
                className={`font-inter flex w-full items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center shrink-0">
                  {isSelected && <FiCheck className="h-3 w-3" />}
                </span>
                <span className="font-mono">{option}</span>
                {submitted && isCorrectOption && (
                  <FiCheckCircle className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />
                )}
                {submitted && isSelected && !isCorrectOption && (
                  <FiXCircle className="h-4 w-4 text-red-500 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>


        {/* Feedback after submit */}
        {submitted && (
          <div
            className={`mt-5 rounded-xl border p-4 ${
              isCorrect
                ? "bg-emerald-50 border-emerald-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {isCorrect ? (
                <FiCheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <FiXCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              )}
              <div>
                <p
                  className={`font-inter text-sm font-bold ${
                    isCorrect ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {isCorrect ? "Benar!" : "Belum tepat."}
                </p>
                <p className="font-inter text-sm text-foreground mt-1">
                  Jawaban yang benar:{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {currentQuestion.options[currentQuestion.correctIndex]}
                  </span>
                </p>
              </div>
            </div>
            <div className="font-inter text-sm text-foreground/90 leading-relaxed mt-1 pl-7">
              {currentQuestion.explanation}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex justify-end">
          {!submitted ? (
            <button
              onClick={() => {
                if (selectedIndex === null) return;
                setSubmitted(true);
                setResults((prev) => [
                  ...prev,
                  selectedIndex === currentQuestion.correctIndex,
                ]);
              }}
              disabled={selectedIndex === null}
              className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Jawaban
              <FiArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (isLast) {
                  setPhase("done");
                } else {
                  setCurrentIndex((i) => i + 1);
                  setSelectedIndex(null);
                  setSubmitted(false);
                }
              }}
              className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
            >
              {isLast ? "Lihat Hasil" : "Soal Berikutnya"}
              <FiArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

