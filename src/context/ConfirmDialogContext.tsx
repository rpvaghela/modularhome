"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { AlertTriangle, HelpCircle, AlertCircle, Trash2, X, Check } from "lucide-react";

export type ConfirmType = "danger" | "warning" | "info" | "success";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  icon?: "trash" | "alert" | "help" | "warning" | "check";
}

type ConfirmFunction = (options: ConfirmOptions | string) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmFunction | null>(null);

export function useConfirm(): ConfirmFunction {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }
  return context;
}

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
  }>({
    isOpen: false,
    options: { message: "" },
  });

  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const confirm: ConfirmFunction = useCallback((options) => {
    const normalizedOptions: ConfirmOptions =
      typeof options === "string" ? { message: options } : options;

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setDialogState({
        isOpen: true,
        options: normalizedOptions,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, []);

  // Keyboard accessibility: Escape to cancel, Enter to confirm
  useEffect(() => {
    if (!dialogState.isOpen) return;

    const timer = setTimeout(() => {
      confirmButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogState.isOpen, handleCancel]);

  const { options, isOpen } = dialogState;
  const type = options.type || "warning";
  const title = options.title || (type === "danger" ? "Confirm Action" : "Please Confirm");
  const confirmText = options.confirmText || (type === "danger" ? "Delete" : "Confirm");
  const cancelText = options.cancelText || "Cancel";

  const renderIcon = () => {
    if (options.icon === "trash" || type === "danger") {
      return (
        <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200/80 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
          <Trash2 className="w-5 h-5" />
        </div>
      );
    }
    if (type === "success" || options.icon === "check") {
      return (
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    }
    if (type === "info" || options.icon === "help") {
      return (
        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 text-[#d97706] flex items-center justify-center shrink-0 shadow-xs">
          <HelpCircle className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-[#fef3c7] border border-[#fde68a] text-[#b45309] flex items-center justify-center shrink-0 shadow-xs">
        <AlertTriangle className="w-5 h-5" />
      </div>
    );
  };

  const getConfirmButtonClasses = () => {
    if (type === "danger") {
      return "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm hover:shadow-md";
    }
    if (type === "success") {
      return "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm hover:shadow-md";
    }
    return "bg-[#fcb907] hover:bg-[#e5a706] active:bg-[#d97706] text-[#101114] shadow-sm hover:shadow-md";
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={handleCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div
            className="relative bg-white rounded-[22px] border border-[#e5e7eb] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            {/* Header Accent Strip */}
            <div
              className={`h-1.5 w-full ${
                type === "danger"
                  ? "bg-red-600"
                  : type === "success"
                  ? "bg-emerald-500"
                  : "bg-[#fcb907]"
              }`}
            />

            {/* Modal Body */}
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3.5">
                {renderIcon()}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      id="confirm-dialog-title"
                      className="text-base sm:text-lg font-black text-[#101114] tracking-tight leading-snug"
                    >
                      {title}
                    </h3>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-gray-400 hover:text-[#101114] p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1.5 font-medium whitespace-pre-line">
                    {options.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-bold text-xs sm:text-[13px] transition-colors cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  ref={confirmButtonRef}
                  type="button"
                  onClick={handleConfirm}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-[13px] transition-all cursor-pointer ${getConfirmButtonClasses()}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}
