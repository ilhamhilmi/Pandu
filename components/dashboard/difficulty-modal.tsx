"use client";

import React, { useState } from "react";
import { FiHelpCircle, FiX } from "react-icons/fi";

interface DifficultyModalProps {
  isOpen: boolean;
  onConfirm: (feedback: string) => void;
  onCancel: () => void;
  processing?: boolean;
  title?: string;
  question?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function DifficultyModal({
  isOpen,
  onConfirm,
  onCancel,
  processing = false,
  title = "Lanjut ke Level Berikutnya",
  question = "Kamu kesulitan di bagian mana?",
  placeholder = "Contoh: masih bingung dengan CSS Flexbox, atau kurang paham konsep array... (opsional)",
  confirmText = "Lanjutkan",
  cancelText = "Batal",
}: DifficultyModalProps) {
  const [feedback, setFeedback] = useState("");

  // Reset input each time modal opens
  React.useEffect(() => {
    if (isOpen) setFeedback("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl border border-border shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <FiX className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <FiHelpCircle className="h-7 w-7 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-inter text-lg font-semibold text-center text-foreground mb-2">
          {title}
        </h3>

        {/* Question */}
        <p className="font-inter text-sm text-center text-muted-foreground mb-4">
          {question}
        </p>

        {/* Textarea */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={processing}
          placeholder={placeholder}
          rows={4}
          className="font-inter w-full resize-none rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
        />

        <p className="font-inter text-xs text-muted-foreground mt-2 mb-4">
          Jawaban ini akan menjadi masukan untuk AI menyusun task di fase
          berikutnya. Boleh dikosongkan.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            disabled={processing}
            className="font-inter flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground bg-white hover:bg-muted transition-colors cursor-pointer disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            onClick={() => onConfirm(feedback)}
            disabled={processing}
            className="font-inter flex-1 px-4 py-2.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60"
          >
            {processing ? "Membuat task..." : confirmText}
          </button>
        </div>

        {/* Skip option */}
        <div className="mt-3 text-center">
          <button
            onClick={() => onConfirm("")}
            disabled={processing}
            className="font-inter text-xs font-medium text-primary hover:underline cursor-pointer disabled:opacity-60"
          >
            Tidak ada kesulitan, lanjut saja
          </button>
        </div>
      </div>
    </div>
  );
}