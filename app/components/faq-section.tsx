"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const FAQ_ITEMS = [
  {
    question: "How does real-time queue voting work?",
    answer:
      "Anyone in the room can paste a YouTube video or Shorts link into the search bar. Everyone votes in real-time with live score updates, and the highest-voted video automatically plays next.",
  },
  {
    question: "Do my friends need an account to join?",
    answer:
      "No, friends can join watch rooms instantly via your 4-digit room code or invite link without any complicated setup.",
  },
  {
    question: "How accurate is the video synchronization?",
    answer:
      "Syncore runs on custom low-latency WebSockets with sub-50ms sync intervals, ensuring everyone in the room watches frame-by-frame together.",
  },
  {
    question: "Can I create private password-protected rooms?",
    answer:
      "Yes. You can host private watch sessions with room codes and passwords, or open public rooms for communities.",
  },
  {
    question: "Is Syncore free to use?",
    answer:
      "Yes, Syncore is completely free with unlimited room creation, real-time queues, and persistent watch history.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="mt-28 sm:mt-36 w-full max-w-6xl px-2 sm:px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start text-left scroll-mt-24"
    >
      {/* Left Column: Title & Subtitle */}
      <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-24">
        <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-100 leading-tight">
          Frequently asked questions
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Everything you need to know about streaming on Syncore.
        </p>
      </div>

      {/* Right Column: Questions Accordion */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-neutral-800/70 bg-neutral-900/40 backdrop-blur-sm overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-medium text-neutral-200 hover:text-white transition cursor-pointer"
              >
                <span>{item.question}</span>
                <span
                  className={`ml-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-neutral-400">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
