"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TOUR_STEPS } from "./tour-steps-data";

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TooltipPosition {
  top: number;
  left: number;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function OnboardingTour({
  isOpen,
  onClose,
}: OnboardingTourProps) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const currentStep = TOUR_STEPS[currentStepIndex];
  const totalSteps = TOUR_STEPS.length;

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem("syncore_onboarding_completed", "true");
    } catch {
      // Ignore localStorage errors
    }
    setIsTourActive(false);
    setCurrentStepIndex(0);
    onClose();
  }, [onClose]);

  const handleStartTour = () => {
    setCurrentStepIndex(0);
    setIsTourActive(true);
  };

  const handleNext = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  }, [currentStepIndex, totalSteps, handleDismiss]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (!isTourActive) {
      setTooltipPos(null);
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        const r = el.getBoundingClientRect();
        const cardWidth = 300;
        const cardHeight = 150;

        setTargetRect({
          top: r.top - 4,
          left: r.left - 4,
          width: r.width + 8,
          height: r.height + 8,
        });

        let left = r.left;
        if (left + cardWidth > window.innerWidth - 16) {
          left = window.innerWidth - cardWidth - 16;
        }
        if (left < 16) left = 16;

        let top = r.bottom + 10;
        if (top + cardHeight > window.innerHeight - 16) {
          top = Math.max(16, r.top - cardHeight - 10);
        }

        setTooltipPos({ top, left });
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const timer = setTimeout(updatePosition, 100);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      clearTimeout(timer);
    };
  }, [currentStep.targetId, isTourActive]);

  useEffect(() => {
    if (!isOpen) {
      setIsTourActive(false);
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (isTourActive) {
        if (e.key === "ArrowRight" || e.key === "Enter") {
          handleNext();
        } else if (e.key === "ArrowLeft") {
          handlePrev();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isTourActive, handleNext, handlePrev, handleDismiss]);

  if (!isOpen) return null;

  return (
    <>
      {/* Ambient Focus Backdrop that softly dims other sections */}
      <AnimatePresence>
        {isTourActive && targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
          >
            <motion.div
              key={currentStep.targetId}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                top: targetRect.top,
                left: targetRect.left,
                width: targetRect.width,
                height: targetRect.height,
              }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="absolute rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isTourActive ? (
          /* Initial Floating Prompt in Bottom-Right Corner */
          <aside
            aria-label="Onboarding Prompt"
            className="fixed bottom-6 right-6 z-50 w-full max-w-[320px] pointer-events-auto"
          >
            <motion.div
              key="prompt-card"
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="rounded-2xl border border-neutral-800/90 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-neutral-100">
                  Welcome to Syncore
                </h3>
                <span className="text-[10px] font-mono text-neutral-500">
                  TOUR
                </span>
              </div>

              <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                Quick guide on queueing tracks, voting, and creating rooms.
              </p>

              <div className="mt-3.5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="rounded-lg px-2.5 py-1 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleStartTour}
                  className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-950 transition hover:bg-neutral-200 shadow-sm cursor-pointer active:scale-95"
                >
                  Start Onboarding
                </button>
              </div>
            </motion.div>
          </aside>
        ) : (
          /* Step Tooltip Card */
          tooltipPos && (
            <motion.div
              key={`tooltip-${currentStepIndex}`}
              initial={{ opacity: 0, y: 4, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                top: tooltipPos.top,
                left: tooltipPos.left,
              }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed z-50 w-full max-w-[300px] pointer-events-auto rounded-2xl border border-neutral-800/90 bg-neutral-900/95 p-3.5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono tracking-wider text-neutral-400">
                  {currentStep.badge}
                </span>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-[11px] text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                >
                  Exit Tour
                </button>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-neutral-100">
                  {currentStep.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                  {currentStep.description}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className={`text-xs text-neutral-400 transition cursor-pointer ${
                    currentStepIndex === 0
                      ? "opacity-0 pointer-events-none"
                      : "hover:text-white"
                  }`}
                >
                  Back
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-500">
                    {currentStepIndex + 1}/{totalSteps}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-white px-3.5 py-1 text-xs font-medium text-neutral-950 transition hover:bg-neutral-200 shadow-sm cursor-pointer active:scale-95"
                  >
                    {currentStepIndex === totalSteps - 1 ? "Finish" : "Next →"}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </>
  );
}
