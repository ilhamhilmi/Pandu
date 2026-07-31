"use client";

import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  icon,
}: ConfirmationModalProps) {
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
          {icon || (
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertTriangle className="h-7 w-7 text-red-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-inter text-lg font-semibold text-center text-foreground mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="font-inter text-sm text-center text-muted-foreground mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="font-inter flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground bg-white hover:bg-muted transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="font-inter flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}