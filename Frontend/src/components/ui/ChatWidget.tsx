import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Bot, Leaf, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";

import { ApiError } from "@/lib/api";
import { sendChatRequest } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const starterPrompts = [
  "What should I plant this season?",
  "How can I improve my tomato yield?",
  "Explain today's market trends",
];

function extractReply(response: unknown): string {
  if (response == null) {
    return "No response received.";
  }

  if (typeof response === "string") {
    return response;
  }

  if (typeof response !== "object") {
    return String(response);
  }

  const payload = response as Record<string, unknown>;
  const keys = ["answer", "response", "output", "text", "message"];
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  try {
    return JSON.stringify(response, null, 2);
  } catch {
    return "Unable to parse Flowise response.";
  }
}

export function ChatWidget() {
  const initialMessage: Message = {
    role: "assistant",
    text: "Hi! I am your FarmSmart assistant. Ask about crops, prices, pests, selling groups, or planning your next season.",
  };
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  async function submitQuestion(questionText: string) {
    const question = questionText.trim();
    if (!question || loading) {
      return;
    }

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);

    try {
      const response = await sendChatRequest({ question });
      const answer = extractReply(response);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof ApiError
          ? error.message
          : "Sorry, I could not connect to the chat service. Please try again in a moment.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitQuestion(input);
  }

  function handleNewChat() {
    if (loading) {
      return;
    }

    setInput("");
    setMessages([initialMessage]);
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-3",
        open
          ? "inset-x-3 bottom-3 top-3 items-stretch sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:items-end"
          : "inset-x-3 bottom-4 items-end sm:inset-x-auto sm:bottom-6 sm:right-6",
      )}
    >
      {open ? (
        <section
          className="flex max-h-full w-full flex-col overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white/95 shadow-[0_24px_80px_rgba(21,64,39,0.24)] backdrop-blur-xl sm:max-h-[calc(100dvh-3rem)] sm:w-[410px]"
          aria-label="FarmSmart chat assistant"
        >
          <div className="relative shrink-0 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.34),transparent_34%),linear-gradient(135deg,#104c31,#17643d_52%,#8f5a18)] px-5 py-4 text-white">
            <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full border border-white/20 bg-white/10" />
            <div className="absolute bottom-0 right-6 h-16 w-28 rounded-t-full bg-lime-200/10 blur-sm" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 shadow-inner ring-1 ring-white/25">
                  <Leaf className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold tracking-tight">FarmSmart Assistant</h2>
                    <span className="rounded-full bg-lime-200/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-lime-50 ring-1 ring-white/20">
                      Live
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-emerald-50/85">
                    Crop advice, market insight, and quick farm planning.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 rounded-full bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/20 hover:text-white disabled:opacity-50"
                  onClick={handleNewChat}
                  disabled={loading || messages.length === 1}
                >
                  New chat
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 rounded-full bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/20 hover:text-white"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Close
                </Button>
              </div>
            </div>

            <div className="relative mt-4 grid grid-cols-3 gap-2 text-[11px] font-medium text-emerald-950">
              <div className="rounded-2xl bg-white/85 px-3 py-2 shadow-sm">
                <span className="block text-[10px] uppercase tracking-wide text-emerald-700/70">
                  Focus
                </span>
                Crops
              </div>
              <div className="rounded-2xl bg-white/85 px-3 py-2 shadow-sm">
                <span className="block text-[10px] uppercase tracking-wide text-emerald-700/70">
                  Finds
                </span>
                Prices
              </div>
              <div className="rounded-2xl bg-white/85 px-3 py-2 shadow-sm">
                <span className="block text-[10px] uppercase tracking-wide text-emerald-700/70">
                  Helps
                </span>
                Plans
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,#fffdf5_0%,#f4f8ed_100%)]">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}
                  >
                    {!isUser ? (
                      <div className="mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-900 text-lime-100 shadow-sm">
                        <Bot className="h-4 w-4" aria-hidden="true" />
                      </div>
                    ) : null}

                    <div
                      className={cn(
                        "max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm",
                        isUser
                          ? "rounded-br-md bg-emerald-800 text-white shadow-emerald-950/10"
                          : "rounded-bl-md border border-emerald-900/10 bg-white text-emerald-950",
                      )}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}

              {loading ? (
                <div className="flex items-end gap-2">
                  <div className="mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-900 text-lime-100 shadow-sm">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2 rounded-3xl rounded-bl-md border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-700" aria-hidden="true" />
                    Thinking through the farm notes...
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 ? (
              <div className="border-t border-emerald-900/10 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900/60">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Try asking
                </div>
                <div className="flex flex-wrap gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="rounded-full border border-emerald-900/10 bg-white px-3 py-2 text-left text-xs font-medium text-emerald-950 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-700/30 hover:bg-lime-50 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={loading}
                      onClick={() => submitQuestion(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form className="border-t border-emerald-900/10 bg-white/80 px-4 py-3" onSubmit={handleSubmit}>
              <div className="flex items-end gap-2 rounded-3xl border border-emerald-900/10 bg-white p-2 shadow-inner shadow-emerald-950/5 focus-within:ring-2 focus-within:ring-emerald-700/15">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void submitQuestion(input);
                    }
                  }}
                  placeholder="Ask about crops, pests, prices..."
                  className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-emerald-950 outline-none placeholder:text-emerald-900/40"
                />
                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="h-11 w-11 shrink-0 rounded-2xl bg-emerald-800 p-0 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-700"
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-center text-[11px] text-emerald-900/45">
                Press Enter to send. Use Close or Esc to leave chat.
              </p>
            </form>
          </div>
        </section>
      ) : (
        <Button
          variant="default"
          className="group h-auto rounded-full bg-emerald-800 px-4 py-3 text-white shadow-[0_16px_40px_rgba(21,64,39,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-700"
          onClick={() => setOpen(true)}
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-lime-200 text-emerald-950 transition group-hover:rotate-[-8deg]">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-sm font-bold">Ask FarmSmart</span>
            <span className="text-xs font-medium text-lime-50/75">Crops, prices, farm plans</span>
          </span>
        </Button>
      )}
    </div>
  );
}
